import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function SellerLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/customer/homePage"); // Quay về login
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="font-bold mb-6">Seller Panel</h2>
        <nav className="flex-1 space-y-3">
          <Link to="dashboard" className="block hover:text-sky-400">
            Dashboard
          </Link>
          <Link to="order" className="block hover:text-sky-400">
            Đơn hàng
          </Link>
          <Link to="product" className="block hover:text-sky-400">
            Sản phẩm
          </Link>
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-gray-700 pt-4">
          {currentUser ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm">
                Xin chào, <b>{currentUser.username}</b>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sky-400 hover:underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
