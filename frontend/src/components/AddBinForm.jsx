import { useState } from "react";
import { theme } from "../theme";
import { CAMPUS_BLOCKS, BIN_TYPES } from "../constants/bins";

const EMPTY_FORM = {
  block: "Block A",
  location: "",
  type: "wet",
  fillLevel: "0",
};

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
      const newBin = await onSubmit({
        block: form.block,
        location: form.location,
        type: form.type,
        fillLevel: Number(form.fillLevel),
      });
      setForm(EMPTY_FORM);
      onCancel?.(newBin);
    } catch (err) {
      setFormError(err.message || "Failed to add dustbin");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-bin-form" onSubmit={handleSubmit}>
      <h3 style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.text }}>
        Add New Dustbin
      </h3>

      <div className="add-bin-form__grid">
        <label>
          Block / Zone
          <select name="block" value={form.block} onChange={handleChange} required>
            {CAMPUS_BLOCKS.map((block) => (
              <option key={block} value={block}>
                {block}
              </option>
            ))}
          </select>
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
