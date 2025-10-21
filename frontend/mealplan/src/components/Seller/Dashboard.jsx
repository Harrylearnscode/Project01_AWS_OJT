import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertCircle,
  Clock,
  RefreshCw,
  DollarSign,
  Users,
  ArrowRight,
} from "lucide-react";
import DashboardService from "../../api/service/Dashboard.service";

// Utility functions
function currency(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

function formatDate(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Status badge component
const StatusBadge = ({ status }) => {
  const map = {
    pending: {
      text: "Chờ xử lý",
      cls: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    },
    processing: {
      text: "Đang xử lý",
      cls: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    },
    shipped: {
      text: "Đã gửi",
      cls: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
    },
    delivered: {
      text: "Đã giao",
      cls: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    },
    cancelled: {
      text: "Đã hủy",
      cls: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    },
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${map[status]?.cls || "bg-slate-100 text-slate-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
        status === 'pending' ? 'bg-blue-500' :
        status === 'processing' ? 'bg-blue-700' :
        status === 'shipped' ? 'bg-indigo-500' :
        status === 'delivered' ? 'bg-emerald-500' :
        'bg-rose-500'
      }`}></span>
      {map[status]?.text || status}
    </span>
  );
};

// Dashboard header component
const DashboardHeader = ({ onRefresh }) => {
  return (
    <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 text-white rounded-2xl p-5 shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-white/80 text-sm">Xem tổng quan về đơn hàng và sản phẩm của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition">
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-white/80">Ngày: <span className="font-semibold text-white">{new Date().toLocaleDateString('vi-VN')}</span></div>
    </div>
  );
};

// Summary cards component
const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Tổng doanh thu",
      value: currency(summary.totalRevenue || 0),
      icon: <DollarSign size={20} className="text-green-500" />,
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Tổng đơn hàng",
      value: summary.totalOrders || 0,
      icon: <ShoppingBag size={20} className="text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Đơn chờ xử lý",
      value: summary.pendingOrders || 0,
      icon: <Clock size={20} className="text-orange-500" />,
      color: "bg-orange-50 border-orange-200",
    },
    {
      title: "Sản phẩm sắp hết",
      value: summary.lowInventoryProducts || 0,
      icon: <AlertCircle size={20} className="text-red-500" />,
      color: "bg-red-50 border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
      {cards.map((card, index) => (
        <div key={index} className={`p-5 rounded-xl border ${card.color} shadow-sm`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">{card.title}</p>
              <p className="text-slate-900 text-xl font-semibold mt-1">{card.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-white shadow-sm">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Recent orders component
const RecentOrders = ({ orders }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div className="px-5 py-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <h2 className="font-medium text-blue-900">Đơn hàng gần đây</h2>
        <a href="/seller/order" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
          Xem tất cả <ArrowRight size={14} />
        </a>
      </div>
      <div className="divide-y divide-blue-100">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-blue-50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-blue-900">#{order.id}</div>
                  <div className="text-sm text-slate-500 mt-1">
                    {order.customer || "Khách hàng"} • {formatDate(order.date || order.createdAt)}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-semibold text-slate-900">{currency(order.total || order.totalAmount || 0)}</div>
                  <div className="mt-1">
                    <StatusBadge status={order.status || "pending"} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-500">
            Không có đơn hàng nào.
          </div>
        )}
      </div>
    </div>
  );
};

// Top products component
const TopProducts = ({ products }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div className="px-5 py-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <h2 className="font-medium text-blue-900">Sản phẩm bán chạy</h2>
        <a href="/seller/product" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
          Xem tất cả <ArrowRight size={14} />
        </a>
      </div>
      <div className="divide-y divide-blue-100">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="p-4 hover:bg-blue-50 transition">
              <div className="flex justify-between items-center">
                <div className="font-medium text-slate-900">{product.name}</div>
                <div className="text-slate-500 text-sm">{product.count} đơn</div>
              </div>
              <div className="mt-1 text-slate-500 text-sm flex justify-between">
                <div>Giá: {currency(product.price || 0)}</div>
                <div className="font-medium text-slate-800">
                  {currency((product.price || 0) * (product.count || 0))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-500">
            Không có dữ liệu sản phẩm.
          </div>
        )}
      </div>
    </div>
  );
};

// Sales chart component
const SalesChart = ({ orders }) => {
  // Process data for chart
  const monthlyData = Array(12).fill(0);
  
  if (orders && orders.length > 0) {
    orders.forEach(order => {
      if (!order.createdAt) return;
      
      const date = new Date(order.createdAt);
      if (!isNaN(date.getTime())) {
        const month = date.getMonth();
        monthlyData[month] += (order.totalAmount || 0);
      }
    });
  }
  
  const data = monthlyData.map((value, index) => ({
    name: `Tháng ${index + 1}`,
    value
  }));
  
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
        <h2 className="font-medium text-blue-900">Doanh thu theo tháng</h2>
      </div>
      <div className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => currency(value)} />
            <Tooltip formatter={(value) => [currency(value), "Doanh thu"]} />
            <Legend />
            <Bar dataKey="value" name="Doanh thu" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Order status distribution chart
const OrderStatusChart = ({ orders }) => {
  // Count orders by status
  const statusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };
  
  if (orders && orders.length > 0) {
    orders.forEach(order => {
      const status = order.status || 'pending';
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });
  }
  
  // Transform for chart
  const data = Object.keys(statusCounts).map(key => ({
    name: key === 'pending' ? 'Chờ xử lý' :
          key === 'processing' ? 'Đang xử lý' :
          key === 'shipped' ? 'Đã gửi' :
          key === 'delivered' ? 'Đã giao' : 
          'Đã hủy',
    value: statusCounts[key]
  })).filter(item => item.value > 0);
  
  // Colors for different statuses
  const COLORS = ['#3b82f6', '#60a5fa', '#6366f1', '#10b981', '#f43f5e'];
  
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
        <h2 className="font-medium text-blue-900">Đơn hàng theo trạng thái</h2>
      </div>
      <div className="p-4 h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} đơn`, "Số lượng"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Không có dữ liệu đơn hàng.
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await DashboardService.getDashboardData();
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        setError("Không thể tải dữ liệu Dashboard");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader onRefresh={fetchDashboardData} />
      
      {error && (
        <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
          <button 
            className="mt-2 text-sm font-medium text-rose-600 hover:text-rose-800"
            onClick={fetchDashboardData}
          >
            Thử lại
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-blue-200 p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Đang tải dữ liệu Dashboard...</p>
        </div>
      ) : (
        dashboardData && (
          <>
            <SummaryCards summary={dashboardData.summary} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentOrders orders={dashboardData.recentOrders} />
              <TopProducts products={dashboardData.topProducts} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SalesChart orders={dashboardData.orders} />
              <OrderStatusChart orders={dashboardData.orders} />
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Dashboard;