import { useState } from "react";
import api from "../api";
import Nav from "../components/Nav";

export default function Settings() {
  const [threshold, setThreshold] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    api.put("/settings", { value: parseInt(threshold) })
      .then(() => setMessage("Default low stock threshold updated!"))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: 20 }}>
      <Nav />
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Default Low Stock Threshold:
          <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} required />
        </label>
        <button type="submit" style={{ marginLeft: 10 }}>Save</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
