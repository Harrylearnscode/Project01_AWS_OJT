import { useState } from "react";
import AuthService from "../../api/service/Auth.service";

export default function Verify({ onSuccess, defaultEmail = "" }) {
  const [form, setForm] = useState({
    email: defaultEmail,
    verificationCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.verify(form);
      console.log("Verification successful:", res);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Xác minh tài khoản
      </h2>

      <input
        type="email"
        name="email"
        placeholder="Nhập email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-green-400"
        required
      />

      <input
        type="text"
        name="verificationCode"
        placeholder="Mã xác minh"
        value={form.verificationCode}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl mb-6 focus:ring-2 focus:ring-green-400"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
      >
        Xác minh
      </button>
    </form>
  );
}
