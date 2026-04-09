import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent form default submission
    if (!username || !password) {
      return alert("Username and password are required.");
    }
    try {
      const response = await loginUser({ username, password });
      const { token, user } = response.data;
      login(user, token);
      localStorage.setItem("loginStatus", "true"); // Add this line
      alert(`Welcome ${user.username}`);
      navigate("/");
    } catch (error) {
      alert("Invalid credentials. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          name="uname"
          placeholder="Enter Username Here"
        />
        <input
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          name="password"
          placeholder="Enter Password Here"
        />
        <button className="btnn" type="submit">
          Login
        </button>
      </form>
      <p className="link">
        Dont have an account?<br />
        <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
}