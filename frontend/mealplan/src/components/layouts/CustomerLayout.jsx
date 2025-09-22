import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function CustomerLayout() {
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between">
        <div className="font-bold">FITFOOD.VN</div> {/* Logo */}
        <nav className="space-x-4">
          <Link to="home">Trang chủ</Link>
          <Link to="shop">Thực đơn</Link>
          <Link to="shoppingCart">Giỏ hàng</Link>

          {!currentUser ? (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          ) : (
            <>
              <span>Xin chào, {currentUser.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </>
          )}
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
