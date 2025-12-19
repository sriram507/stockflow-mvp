import { useEffect, useState } from "react";
import api from "../api";
import Nav from "../components/Nav";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard");
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <Nav />

      <h2>Dashboard</h2>

      <div style={{ marginBottom: 20 }}>
        <h3>Total Products: {data.count}</h3>
        <h3>Total Quantity: {data.totalQty}</h3>
      </div>

      <h3>Low Stock Items</h3>

      {data.lowStock.length === 0 ? (
        <p>No low stock items 🎉</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Low Stock Threshold</th>
            </tr>
          </thead>
          <tbody>
            {data.lowStock.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.quantity}</td>
                <td>{product.low_stock ?? "Default"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
