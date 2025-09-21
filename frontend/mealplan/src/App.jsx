import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "./components/layouts/CustomerLayout.jsx";
import SellerLayout from "./components/layouts/SellerLayout";

// // Pages
// import HomePage from "./pages/customer/HomePage";
// import MenuPage from "./pages/customer/MenuPage";
// import CartPage from "./pages/customer/CartPage";

// import Dashboard from "./pages/seller/Dashboard";
// import Orders from "./pages/seller/Orders";
// import Products from "./pages/seller/Products";

// import Login from "./pages/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          {/* <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="cart" element={<CartPage />} /> */}
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={<SellerLayout />}>
          {/* <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} /> */}
        </Route>

        {/* Mặc định */}
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
