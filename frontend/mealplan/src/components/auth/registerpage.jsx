import { useState } from "react";
import AuthService from "../../api/service/Auth.service";

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.register(form);
      console.log("Registration successful:", res);

      if (onSuccess) onSuccess(form.email); // truyền email để verify
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>

      <input
        type="text"
        name="username"
        placeholder="Tên đăng nhập"
        value={form.username}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Số điện thoại"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="address"
        placeholder="Địa chỉ"
        value={form.address}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-6 focus:ring-2 focus:ring-blue-400"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition"
      >
        Đăng ký
      </button>
    </form>
  );
}
