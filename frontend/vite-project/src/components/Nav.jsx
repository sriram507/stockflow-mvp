import { Link } from "react-router-dom";

export default function Nav() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
      <Link to="/dashboard" style={{ marginRight: 20 }}>Dashboard</Link>
      <Link to="/products" style={{ marginRight: 20 }}>Products</Link>
      <Link to="/settings" style={{ marginRight: 20 }}>Settings</Link>
      <button onClick={handleLogout} style={{ marginLeft: 20 }}>Logout</button>
    </nav>
  );
}
