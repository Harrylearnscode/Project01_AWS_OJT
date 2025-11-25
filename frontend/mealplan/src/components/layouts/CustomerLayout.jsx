"use client";

import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import Modal from "../ui/Modal";
import Login from "../auth/loginpage";
import Register from "../auth/registerpage";
import Verify from "../auth/verify";
import AuthModalContext from "../../context/AuthModalContext.jsx";

export default function CustomerLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal control
  const [modalType, setModalType] = useState(null); // "login" | "register" | "verify"
  const [verifyEmail, setVerifyEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/customer/homePage");
  };

  // Wrapper to protect navigation inside layout
  const navigateProtected = (path) => {
    if (!currentUser) {
      openModal("login");
      return;
    }
    navigate(path);
  };

  return (
    <AuthModalContext.Provider value={{ openModal, setModalType }}>
    <div className="min-h-screen flex flex-col bg-background">

      {/* HEADER */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              to="/customer/homePage"
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              FITFOOD.VN
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="homePage" className="nav-link">
                Trang chủ
              </Link>
              <Link to="customerShop" className="nav-link">
                Thực đơn
              </Link>

              {/* Protected menu items */}
              <button onClick={() => navigateProtected("/customer/ordershistory")} className="nav-link">
                Đơn hàng
              </button>

              <button onClick={() => navigateProtected("/customer/shoppingCart")} className="nav-link flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Giỏ hàng
              </button>
            </nav>

            {/* USER SECTION */}
            <div className="hidden md:flex items-center space-x-4">
              {!currentUser ? (
                <>
                  <button onClick={() => openModal("login")} className="nav-link">
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => openModal("register")}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigateProtected("/customer/userProfile")}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <User className="w-4 h-4" /> Xin chào, {currentUser.name}
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg hover:bg-destructive/90"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-4">
            <Link to="homePage" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
            <Link to="customerShop" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Thực đơn</Link>

            <button
              onClick={() => { setMobileMenuOpen(false); navigateProtected("/customer/ordershistory"); }}
              className="mobile-link"
            >
              Đơn hàng
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); navigateProtected("/customer/shoppingCart"); }}
              className="mobile-link flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Giỏ hàng
            </button>

            <div className="border-t border-border pt-4">
              {!currentUser ? (
                <>
                  <button onClick={() => { openModal("login"); setMobileMenuOpen(false); }} className="mobile-link">
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => { openModal("register"); setMobileMenuOpen(false); }}
                    className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg w-full text-center"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-foreground px-1">
                    <User className="w-4 h-4" /> Xin chào, {currentUser.name}
                  </div>

                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg w-full mt-2"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground">
        © 2025 FITFOOD.VN - Meal Plan Delivery Service
      </footer>

      {/* MODAL HANDLING */}
      <Modal isOpen={!!modalType} onClose={closeModal}>
        {modalType === "login" && (
          <Login
            onSuccess={() => {
              closeModal();
              const user = JSON.parse(localStorage.getItem("currentUser"));
              setCurrentUser(user);
              if("SELLER".includes(user.role)) {
                navigate("/seller/dashboard");
              }
            }}
          />
        )}

        {modalType === "register" && (
          <Register
            onSuccess={(email) => {
              setVerifyEmail(email);
              setModalType("verify");
            }}
          />
        )}

        {modalType === "verify" && (
          <Verify
            defaultEmail={verifyEmail}
            onSuccess={() => closeModal()}
          />
        )}
      </Modal>
    </div>
    </AuthModalContext.Provider>
  );
}