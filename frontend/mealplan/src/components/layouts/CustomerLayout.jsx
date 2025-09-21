import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between">
        <div className="font-bold">FITFOOD.VN</div>
        <nav className="space-x-4">
          <Link to="/customer">Trang chủ</Link>
          <Link to="/customer/menu">Thực đơn</Link>
          <Link to="/customer/cart">Giỏ hàng</Link>
        </nav>
      </header>

      {/* Nội dung */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4">© 2025 MealPlan</footer>
    </div>
  );
}
