import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../api/service/Auth.service"; // nhớ import đúng path

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.login({ email, password });
      console.log("Login success:", response);

      navigate("/customer/homePage"); 
    } catch (err) {
      console.error("Login error:", err);
      setError("Sai email hoặc password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Nhập email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Nhập password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg font-medium transition"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
