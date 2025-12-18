import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    const { email, password, orgName } = e.target;
    const res = await api.post("/signup", {
      email: email.value,
      password: password.value,
      orgName: orgName.value
    });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Signup</h2>
      <input name="orgName" placeholder="Organization Name" required /><br />
      <input name="email" placeholder="Email" required /><br />
      <input name="password" type="password" placeholder="Password" required /><br />
      <button type="submit">Sign Up</button>
    </form>
  );
}
