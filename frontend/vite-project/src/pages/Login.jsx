import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    const { email, password } = e.target;
    const res = await api.post("/login", { email: email.value, password: password.value });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" required /><br />
      <input name="password" type="password" placeholder="Password" required /><br />
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </form>
  );
}
