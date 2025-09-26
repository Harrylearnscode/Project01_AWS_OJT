import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "./components/layouts/CustomerLayout.jsx";
import SellerLayout from "./components/layouts/SellerLayout";
import CustomerShop from "./components/Customer/CustomerShop.jsx";
import HomePage from "./components/Customer/homepage.jsx";
import Login from "./components/auth/loginpage.jsx";
import {useAuth} from "./context/AuthContext.jsx";
import ShoppingCart from "./components/Customer/ShoppingCart.jsx";
import Dashboard from "./components/Seller/DashBoard.jsx";
import Orders from "./components/Seller/Order.jsx";
import Products from "./components/Seller/Product.jsx";
import CustomerMealDetail from "./components/Customer/mealdetail.jsx";
import Checkout from "./components/Customer/Checkout.jsx"; 
import Register from "./components/auth/registerpage.jsx";
import Verify from "./components/auth/verify.jsx";


export function PrivateRoute({ children }) {
  // const token = localStorage.getItem("token"); // token sau khi login
  const {user} = useAuth();   // 'customer' hoặc 'seller'

  if (user.role !== "seller") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        
        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="customerShop" element={<CustomerShop />} />
          <Route path="homePage" element={<HomePage />} />
          <Route path="shoppingCart" element={<ShoppingCart />} />
          <Route path="mealdetail/:id" element={<CustomerMealDetail />} />
          <Route path="checkout" element={<CustomerMealDetail />} />
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="order" element={<Orders />} />
          <Route path="product" element={<Products />} />
        </Route>

        {/* Mặc định */}
        <Route path="*" element={<Navigate to="/customer/homePage" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
