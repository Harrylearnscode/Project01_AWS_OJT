import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import OrderDetail from "./components/Customer/OrderDetail.jsx";
import OrderHistory from "./components/Customer/OrdersHistory.jsx";
import Ingredient from "./components/Seller/Ingredient.jsx";
import {Toaster} from "./components/ui/toaster.jsx";
import UserProfile from "./components/Customer/UserProfile.jsx";

function App() {
  const ProtectedRoute = ({ isAuthenticated, allowedRoles, userRole, redirectPath = "/login" }) => {
  // If user is not logged in
  if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
  }
    // If this route requires specific roles
  if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
  }
    return <Outlet />;
  };

  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = JSON.parse(localStorage.getItem("currentUser"))?.role;
  console.log("User Role in App.jsx:", userRole);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />

        {/* PUBLIC Customer pages */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="homePage" element={<HomePage />} />
          <Route path="customerShop" element={<CustomerShop />} />
          <Route path="mealdetail/:id" element={<CustomerMealDetail />} />
        </Route>

        {/* PROTECTED Customer pages */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["CUSTOMER"]}
              userRole={userRole}
            />
          }
        >
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="shoppingCart" element={<ShoppingCart />} />
            <Route path="ordershistory" element={<OrderHistory />} />
            <Route path="ordersdetail/:orderId" element={<OrderDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="userProfile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* Seller Protected */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["SELLER"]}
              userRole={userRole}
            />
          }
        >
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="order" element={<Orders />} />
            <Route path="dishes" element={<Products />} />
            <Route path="ingredients" element={<Ingredient />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/customer/homePage" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
