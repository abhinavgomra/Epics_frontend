import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useBinsDataContext } from "../context/BinsDataContext";
import { CAMPUS_BLOCKS } from "../constants/bins";
import { LoadingState, ErrorState } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
import { createPickupPlan } from "../utils/pickupPlanner";

const markerIcon = (stop, priority) => L.divIcon({
  className: "pickup-map-marker-wrap",
  html: `<span class="pickup-map-marker pickup-map-marker--${priority}">${stop}</span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function PickupPlan() {
  const { bins, readings, loading, error, refetch, markBinCollected } = useBinsDataContext();
  const [area, setArea] = useState("all");
  const [collectingId, setCollectingId] = useState(null);
  const [collectionMessage, setCollectionMessage] = useState("");
  const plan = useMemo(() => createPickupPlan(bins, area, readings), [bins, area, readings]);

  const markCollected = async (bin) => {
    setCollectingId(bin.id);
    setCollectionMessage("");
    try {
      await markBinCollected(bin.id);
      setCollectionMessage(`${bin.id} was marked as collected and removed from today's route.`);
    } catch (collectionError) {
      setCollectionMessage(collectionError.message || "Unable to mark this bin as collected.");
    } finally {
      setCollectingId(null);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} message={error} />;

  return (
    <div className="dashboard-page pickup-plan-page">
      <PageHeader
        title="Ashta Pickup Plan"
        subtitle="Local predictions identify priority bins and arrange the worker's collection stops."
      />

      <div className="pickup-plan-toolbar">
        <label>
          Worker area
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            <option value="all">All areas</option>
            {CAMPUS_BLOCKS.map((block) => <option key={block} value={block}>{block}</option>)}
          </select>
        </label>
        <div className="pickup-plan-summary">
          <strong>{plan.length}</strong> pickups scheduled today
        </div>
      </div>

      <p className="pickup-plan-note">
        Demo locations are placed around Ashta, Madhya Pradesh. Replace them with each bin's actual latitude and longitude before field deployment.
      </p>
      {collectionMessage && <p className="pickup-plan-message">{collectionMessage}</p>}

      <div className="pickup-plan-layout">
        <section className="pickup-route" aria-label="Scheduled pickup route">
          <h2 className="section-title">Worker route</h2>
          {plan.length === 0 ? (
            <p className="pickup-empty">No bins need collection in this area today.</p>
          ) : plan.map((bin) => (
            <article key={bin.id} className={`pickup-stop pickup-stop--${bin.priority}`}>
              <span className="pickup-stop__number">{bin.stop}</span>
              <div>
                <h3>{bin.id} · {bin.location}</h3>
                <p>{bin.block} · {bin.type} waste · {bin.fillLevel}% full</p>
                <small>{bin.reason} Predicted tomorrow: {bin.predictedTomorrow}%.</small>
                <button
                  type="button"
                  className="pickup-stop__collect"
                  onClick={() => markCollected(bin)}
                  disabled={collectingId === bin.id}
                >
                  {collectingId === bin.id ? "Saving…" : "Mark collected"}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="pickup-map-panel" aria-label="Ashta pickup map">
          <MapContainer center={[23.0175, 76.7221]} zoom={13} scrollWheelZoom className="pickup-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {plan.map((bin) => (
              <Marker key={bin.id} position={bin.coordinates} icon={markerIcon(bin.stop, bin.priority)}>
                <Popup>
                  <strong>Stop {bin.stop}: {bin.id}</strong><br />
                  {bin.location}<br />
                  {bin.type} waste · {bin.fillLevel}% full<br />
                  {bin.reason}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>
    </div>
  );
}
