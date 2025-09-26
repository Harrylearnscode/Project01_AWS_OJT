import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../api/service/Auth.service"; // nhớ import đúng path
export default function Register() {
    const navigate = useNavigate();
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
      const res = AuthService.register(form);
        console.log("Registration successful:", res);
        navigate("/verify");
        
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
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
    </div>
  );
}
