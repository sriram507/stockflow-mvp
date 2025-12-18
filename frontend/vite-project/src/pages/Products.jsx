import { useEffect, useState } from "react";
import api from "../api";
import Nav from "../components/Nav";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", sku: "", quantity: 0 });

  const fetchProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = e => {
    e.preventDefault();
    api.post("/products", form).then(() => {
      setForm({ name: "", sku: "", quantity: 0 });
      fetchProducts();
    });
  };

  return (
    <div>
      <Nav />
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} required />
        <button type="submit">Add Product</button>
      </form>

      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
