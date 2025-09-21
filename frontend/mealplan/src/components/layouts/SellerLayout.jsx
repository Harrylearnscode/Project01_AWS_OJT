import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function SellerLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="font-bold mb-4">Seller Panel</h2>
        <nav className="space-y-2">
          <Link to="/seller/dashboard">Dashboard</Link>
          <Link to="/seller/orders">Đơn hàng</Link>
          <Link to="/seller/products">Sản phẩm</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
