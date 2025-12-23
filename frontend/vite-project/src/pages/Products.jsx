import { useEffect, useState } from "react";
import api from "../api";
import Nav from "../components/Nav";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 0,
    cost_price: "",
    selling_price: "",
    low_stock: ""
  });

  const fetchProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      cost_price: form.cost_price ? Number(form.cost_price) : null,
      selling_price: form.selling_price ? Number(form.selling_price) : null,
      low_stock: form.low_stock ? Number(form.low_stock) : null
    };

    if (editingId) {
      api.put(`/products/${editingId}`, payload).then(() => {
        resetForm();
        fetchProducts();
      });
    } else {
      api.post("/products", payload).then(() => {
        resetForm();
        fetchProducts();
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      sku: "",
      quantity: 0,
      cost_price: "",
      selling_price: "",
      low_stock: ""
    });
  };

  const handleEdit = p => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      quantity: p.quantity,
      cost_price: p.cost_price ?? "",
      selling_price: p.selling_price ?? "",
      low_stock: p.low_stock ?? ""
    });
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this product?")) return;

    api.delete(`/products/${id}`).then(fetchProducts);
  };

  return (
    <div>
      <Nav />
      <h2>Products</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="SKU"
          value={form.sku}
          onChange={e => setForm({ ...form, sku: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Cost Price"
          value={form.cost_price}
          onChange={e => setForm({ ...form, cost_price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Selling Price"
          value={form.selling_price}
          onChange={e => setForm({ ...form, selling_price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Low Stock Threshold"
          value={form.low_stock}
          onChange={e => setForm({ ...form, low_stock: e.target.value })}
        />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Low Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
              <td>{p.cost_price ?? "-"}</td>
              <td>{p.selling_price ?? "-"}</td>
              <td>{p.low_stock ?? "-"}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
