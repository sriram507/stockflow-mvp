import { useEffect, useState } from "react";
import api from "../api";
import Nav from "../components/Nav";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <Nav />
      <h2>Dashboard</h2>
      <h3>Total Products: {data.count}</h3>
      <h3>Total Quantity: {data.totalQty}</h3>

      {data.lowStock.length > 0 && (
        <>
          <h4>Low Stock Items:</h4>
          <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Low Stock Threshold</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStock.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.quantity}</td>
                  <td>{p.low_stock ?? 5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
