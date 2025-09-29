import React, { useState } from "react";
import AuthService from "../../api/service/Auth.service";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login({ email, password });

      // lưu user vào localStorage
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Login error:", err);
      setError("Sai email hoặc password!");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

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
        <label className="block text-gray-600 text-sm mb-2">Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Nhập mật khẩu"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg font-medium transition"
      >
        Đăng nhập
      </button>
    </form>
  );
}
