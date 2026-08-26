import { createContext, useContext, useCallback } from "react";
import { useBinsData } from "../hooks/useBinsData";
import { useCollectionsData } from "../hooks/useCollectionsData";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const binsData = useBinsData();

  const updateBinInState = useCallback((updatedBin) => {
    binsData.setBins((prev) =>
      prev.map((b) => (b.id === updatedBin.id ? updatedBin : b)),
    );
    binsData.setLastUpdated(new Date());
  }, [binsData.setBins, binsData.setLastUpdated]);

  const collectionsData = useCollectionsData({
    bins: binsData.bins,
    updateBinInState,
  });

  const value = {
    ...binsData,
    collections: collectionsData.collections,
    collectionsLoading: collectionsData.loading,
    collectionsError: collectionsData.error,
    refetchCollections: collectionsData.refetch,
    addCollection: collectionsData.addCollection,
    markBinCollected: collectionsData.markBinCollected,
    loading: binsData.loading || collectionsData.loading,
    error: binsData.error || collectionsData.error,
    refetch: async () => {
      await Promise.all([binsData.refetch(), collectionsData.refetch()]);
    },
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
}

export function useBinsDataContext() {
  return useAppData();
}
