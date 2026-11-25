import { useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CAMPUS_BLOCKS, BIN_TYPES } from "../constants/bins";

const EMPTY_FORM = {
  block: "Block A",
  location: "",
  type: "wet",
  fillLevel: "0",
  latitude: "",
  longitude: "",
};

function LocationPicker({ position, onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return position ? <CircleMarker center={position} radius={8} pathOptions={{ color: "#047857", fillColor: "#10b981", fillOpacity: 0.85 }} /> : null;
}

export default function AddBinForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const hasLatitude = form.latitude !== "";
      const hasLongitude = form.longitude !== "";
      if (hasLatitude !== hasLongitude) {
        throw new Error("Enter both latitude and longitude, or select a point on the map");
      }

      const newBin = await onSubmit({
        block: form.block,
        location: form.location,
        type: form.type,
        fillLevel: Number(form.fillLevel),
        latitude: hasLatitude ? Number(form.latitude) : undefined,
        longitude: hasLongitude ? Number(form.longitude) : undefined,
      });
      setForm(EMPTY_FORM);
      onCancel?.(newBin);
    } catch (err) {
      setFormError(err.message || "Failed to add dustbin");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPosition = form.latitude !== "" && form.longitude !== ""
    ? [Number(form.latitude), Number(form.longitude)]
    : null;

  function chooseMapPosition(latitude, longitude) {
    setForm((prev) => ({
      ...prev,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }));
    setFormError("");
  }

  return (
    <form className="add-bin-form" onSubmit={handleSubmit}>
      <h3 className="panel__title">Add New Dustbin</h3>

      <div className="add-bin-form__grid">
        <label>
          Area / Zone
          <input name="block" list="area-options" value={form.block} onChange={handleChange} placeholder="e.g. Block A or MP Nagar" required />
          <datalist id="area-options">
            {CAMPUS_BLOCKS.map((block) => (
              <option key={block} value={block}>
              </option>
            ))}
          </datalist>
        </label>

        <label>
          Location
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Near cafeteria, Floor 2"
            required
          />
        </label>

        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange} required>
            {BIN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Initial Fill Level (%)
          <input
            type="number"
            name="fillLevel"
            min="0"
            max="100"
            value={form.fillLevel}
            onChange={handleChange}
          />
        </label>

        <label>
          Latitude
          <input type="number" name="latitude" min="-90" max="90" step="any" value={form.latitude} onChange={handleChange} placeholder="e.g. 23.0175" />
        </label>

        <label>
          Longitude
          <input type="number" name="longitude" min="-180" max="180" step="any" value={form.longitude} onChange={handleChange} placeholder="e.g. 76.7221" />
        </label>
      </div>

      <div className="location-picker">
        <p>Click on the Ashta map to set this bin’s location.</p>
        <MapContainer center={[23.0175, 76.7221]} zoom={13} className="location-picker__map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker position={selectedPosition} onPick={chooseMapPosition} />
        </MapContainer>
      </div>

      {formError && <p className="add-bin-form__error">{formError}</p>}

      <div className="add-bin-form__actions">
        <button type="button" className="btn-secondary" onClick={() => onCancel?.()}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Adding…" : "Add Dustbin"}
        </button>
      </div>
    </form>
  );
}
