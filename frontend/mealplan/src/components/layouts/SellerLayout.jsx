import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function SellerLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false); // 🔹 trạng thái mở submenu
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/customer/homePage"); // Quay về trang chủ khách hàng
  };

  // Tự động mở submenu nếu đang ở trang con
  useEffect(() => {
    if (location.pathname.includes("/seller/product")) {
      setOpenMenu(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 sticky top-0 h-screen">
        <h2 className="font-bold mb-6 text-lg">Seller Panel</h2>

        <nav className="flex-1 space-y-3 overflow-y-auto">
          <Link
            to="dashboard"
            className={`block hover:text-sky-400 ${
              location.pathname.includes("/dashboard") ? "text-sky-400 font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="order"
            className={`block hover:text-sky-400 ${
              location.pathname.includes("/order") ? "text-sky-400 font-semibold" : ""
            }`}
          >
            Đơn hàng
          </Link>

          {/* Sản phẩm có submenu */}
          <div>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className={`flex justify-between items-center w-full hover:text-sky-400 transition ${
                location.pathname.includes("/product") ? "text-sky-400 font-semibold" : ""
              }`}
            >
              <span>Sản phẩm</span>
              <span className="text-sm">{openMenu ? "▲" : "▼"}</span>
            </button>

            {openMenu && (
              <div className="ml-4 mt-2 space-y-2 text-sm">
                <Link
                  to="ingredients"
                  className={`block hover:text-sky-400 ${
                    location.pathname.includes("ingredients")
                      ? "text-sky-400 font-semibold"
                      : ""
                  }`}
                >
                  Nguyên liệu
                </Link>
                <Link
                  to="dishes"
                  className={`block hover:text-sky-400 ${
                    location.pathname.includes("dishes")
                      ? "text-sky-400 font-semibold"
                      : ""
                  }`}
                >
                  Món ăn
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          {currentUser ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm">
                Xin chào, <b>{currentUser.username}</b>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sky-400 hover:underline text-sm">
              Đăng nhập
            </Link>
          )}
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
