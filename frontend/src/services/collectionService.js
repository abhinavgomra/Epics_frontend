import collectionsData from "../data/collections.json";

const DELAY_MS = 300;

export async function getCollections() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(collectionsData.map((entry) => ({ ...entry })));
      } catch (err) {
        reject(err);
      }
    }, DELAY_MS);
  });
}
