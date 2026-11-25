import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useBinsDataContext } from "../context/BinsDataContext";
import { CAMPUS_BLOCKS } from "../constants/bins";
import { LoadingState, ErrorState } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
import { createPickupPlan } from "../utils/pickupPlanner";

const ASHTA_CENTER = [23.0175, 76.7221];

const markerIcon = (stop, priority) => L.divIcon({
  className: "pickup-map-marker-wrap",
  html: `<span class="pickup-map-marker pickup-map-marker--${priority}">${stop}</span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function WorkerDashboard() {
  const { bins, readings, loading, error, refetch, markBinCollected } = useBinsDataContext();
  const [area, setArea] = useState(CAMPUS_BLOCKS[0]);
  const [activeStop, setActiveStop] = useState(null);
  const [collectingId, setCollectingId] = useState(null);
  const [message, setMessage] = useState("");

  const route = useMemo(() => createPickupPlan(bins, area, readings), [bins, area, readings]);
  const currentStop = route.find((bin) => bin.id === activeStop) || route[0];

  async function completePickup(bin) {
    setCollectingId(bin.id);
    setMessage("");
    try {
      await markBinCollected(bin.id);
      setMessage(`${bin.id} collection saved. Continue to the next stop.`);
      setActiveStop(null);
    } catch (collectionError) {
      setMessage(collectionError.message || "Could not save this collection.");
    } finally {
      setCollectingId(null);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} message={error} />;

  return (
    <main className="dashboard-page worker-page">
      <PageHeader
        title="Worker Collection Route"
        subtitle="Complete the priority stops assigned to your area."
      />

      <section className="worker-toolbar">
        <label>
          Assigned area
          <select value={area} onChange={(event) => { setArea(event.target.value); setActiveStop(null); }}>
            {CAMPUS_BLOCKS.map((block) => <option key={block} value={block}>{block}</option>)}
          </select>
        </label>
        <div className="worker-progress">
          <strong>{route.length}</strong>
          <span>stops remaining</span>
        </div>
      </section>

      {message && <p className="worker-message">{message}</p>}

      <section className="worker-next-stop">
        {currentStop ? (
          <>
            <p className="worker-next-stop__eyebrow">Next stop</p>
            <div className="worker-next-stop__content">
              <span className={`worker-stop-number worker-stop-number--${currentStop.priority}`}>{currentStop.stop}</span>
              <div>
                <h2>{currentStop.id} · {currentStop.location}</h2>
                <p>{currentStop.type} waste · {currentStop.fillLevel}% full · predicted tomorrow: {currentStop.predictedTomorrow}%</p>
                <small>{currentStop.reason}</small>
              </div>
              <button
                type="button"
                className="btn-primary"
                disabled={collectingId === currentStop.id}
                onClick={() => completePickup(currentStop)}
              >
                {collectingId === currentStop.id ? "Saving…" : "Mark collected"}
              </button>
            </div>
          </>
        ) : (
          <div className="worker-done">
            <span aria-hidden="true">✓</span>
            <div><h2>Route complete</h2><p>No pickups remain for this area.</p></div>
          </div>
        )}
      </section>

      <div className="worker-layout">
        <section className="worker-route-list" aria-label="Today's route">
          <h2 className="section-title">Today’s stops</h2>
          {route.length === 0 ? <p className="pickup-empty">No pickups scheduled.</p> : route.map((bin) => (
            <button
              type="button"
              key={bin.id}
              className={`worker-route-item${currentStop?.id === bin.id ? " worker-route-item--active" : ""}`}
              onClick={() => setActiveStop(bin.id)}
            >
              <span className={`worker-stop-number worker-stop-number--${bin.priority}`}>{bin.stop}</span>
              <span>
                <strong>{bin.id} · {bin.location}</strong>
                <small>{bin.type} · {bin.fillLevel}% full</small>
              </span>
            </button>
          ))}
        </section>

        <section className="worker-map-panel" aria-label="Worker route map">
          <MapContainer center={ASHTA_CENTER} zoom={13} scrollWheelZoom className="worker-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {route.map((bin) => (
              <Marker key={bin.id} position={bin.coordinates} icon={markerIcon(bin.stop, bin.priority)} eventHandlers={{ click: () => setActiveStop(bin.id) }}>
                <Popup><strong>Stop {bin.stop}: {bin.id}</strong><br />{bin.location}<br />{bin.reason}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>
    </main>
  );
}
