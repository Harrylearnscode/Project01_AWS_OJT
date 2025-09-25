import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const mockUsers = [
  { username: "seller", password: "123456", role: "SELLER" },
  { username: "customer", password: "123456", role: "CUSTOMER" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Lưu user vào localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Điều hướng theo role
      if (user.role === "SELLER") {
        setRedirectPath("/seller/dashboard"); // vào layout seller
      } else {
        setRedirectPath("/customer/homePage"); // vào trang HomePage cho customer
      }
    } else {
      setError("Sai username hoặc password!");
    }
  };

  // Nếu đã có redirectPath thì Navigate
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Nhập username"
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
