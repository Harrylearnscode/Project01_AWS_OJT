"use client";

import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import Modal from "../ui/Modal";
import Login from "../auth/loginpage";
import Register from "../auth/registerpage";
import Verify from "../auth/verify";

export default function CustomerLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal control
  const [modalType, setModalType] = useState(null); // "login" | "register" | "verify"
  const [verifyEmail, setVerifyEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="homePage"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Trang chủ
              </Link>
              <Link
                to="customerShop"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Thực đơn
              </Link>
              <Link
                to="shoppingCart"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Giỏ hàng
              </Link>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => openModal("login")}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => openModal("register")}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      Xin chào, {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-4 py-4 space-y-4">
              <Link
                to="homePage"
                className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="customerShop"
                className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Thực đơn
              </Link>
              <Link
                to="shoppingCart"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                Giỏ hàng
              </Link>

              <div className="border-t border-border pt-4">
                {!currentUser ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        openModal("login");
                        setMobileMenuOpen(false);
                      }}
                      className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        openModal("register");
                        setMobileMenuOpen(false);
                      }}
                      className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full text-center"
                    >
                      Đăng ký
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <User className="w-4 h-4" />
                      <span className="font-medium">
                        Xin chào, {currentUser.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-muted-foreground">
            © 2025 FITFOOD.VN - Meal Plan Delivery Service
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal isOpen={!!modalType} onClose={closeModal}>
        {modalType === "login" && (
          <Login
            onSuccess={() => {
              closeModal();
              const user = JSON.parse(localStorage.getItem("currentUser"));
              if (user) setCurrentUser(user);
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
            onSuccess={() => {
              closeModal();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
