import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronDown,
  Download,
  RefreshCw,
} from "lucide-react";

const STATUS_OPTIONS = [
  { key: "all", label: "Tất cả", color: "bg-blue-500" },
  { key: "pending", label: "Chờ xử lý", color: "bg-blue-400" },
  { key: "processing", label: "Đang xử lý", color: "bg-sky-500" },
  { key: "shipped", label: "Đã gửi", color: "bg-indigo-500" },
  { key: "delivered", label: "Đã giao", color: "bg-teal-500" },
  { key: "cancelled", label: "Đã hủy", color: "bg-rose-500" },
];

const mockOrders = [
  {
    id: "MP-24001",
    customer: "Nguyễn Văn A",
    phone: "0901 234 567",
    address: "12 Lý Thường Kiệt, Q.10, TP.HCM",
    date: "2025-09-22 10:21",
    itemsCount: 3,
    total: 420000,
    status: "pending",
    items: [
      { name: "Cơm gà nướng", qty: 1, price: 120000 },
      { name: "Salad cá ngừ", qty: 1, price: 90000 },
      { name: "Nước ép cam", qty: 1, price: 60000 },
    ],
    note: "Giao trước 12h trưa",
  },
  {
    id: "MP-24002",
    customer: "Trần Thị B",
    phone: "0908 222 111",
    address: "35 Nguyễn Huệ, Q.1, TP.HCM",
    date: "2025-09-22 08:35",
    itemsCount: 2,
    total: 310000,
    status: "processing",
    items: [
      { name: "Bún thịt nướng", qty: 2, price: 150000 },
    ],
  },
  {
    id: "MP-24003",
    customer: "Phạm Minh C",
    phone: "0912 888 333",
    address: "22 Võ Văn Tần, Q.3, TP.HCM",
    date: "2025-09-21 14:00",
    itemsCount: 4,
    total: 550000,
    status: "shipped",
    items: [
      { name: "Phở bò", qty: 2, price: 200000 },
      { name: "Trà chanh", qty: 2, price: 50000 },
    ],
  },
  {
    id: "MP-24004",
    customer: "Đỗ Hải D",
    phone: "0935 666 777",
    address: "5 Phan Xích Long, Phú Nhuận",
    date: "2025-09-20 17:12",
    itemsCount: 1,
    total: 180000,
    status: "delivered",
    items: [
      { name: "Cơm tấm sườn bì chả", qty: 1, price: 180000 },
    ],
  },
  {
    id: "MP-24005",
    customer: "Lê Thu E",
    phone: "0967 456 222",
    address: "88 Duy Tân, Cầu Giấy, Hà Nội",
    date: "2025-09-18 09:40",
    itemsCount: 2,
    total: 240000,
    status: "cancelled",
    items: [
      { name: "Bánh mì thịt", qty: 2, price: 120000 },
    ],
    note: "Khách hủy do đổi lịch",
  },
];

function currency(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

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
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center justify-center ${map[status]?.cls}`}>
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

const OrdersHeader = ({ onRefresh, total }) => {
  return (
    <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 text-white rounded-2xl p-5 shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Đơn hàng</h1>
          <p className="text-white/80 text-sm">Quản lý, theo dõi và cập nhật trạng thái đơn hàng của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-medium transition">
            <Download size={16} /> Xuất CSV
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-white/80">Tổng số đơn: <span className="font-semibold text-white">{total}</span></div>
    </div>
  );
};

const FiltersBar = ({ search, setSearch, status, setStatus }) => {
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
          <Search size={18} />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
          <Filter size={18} />
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
          <Calendar size={18} />
        </span>
        <input
          type="text"
          placeholder="Khoảng thời gian (ví dụ: 18/09 - 25/09)"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
      </div>
    </div>
  );
};

const StatusTabs = ({ active, setActive, counts }) => {
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      {STATUS_OPTIONS.map((s) => {
        const isActive = active === s.key;
        return (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`whitespace-nowrap inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition border ${
              isActive
                ? "bg-white text-blue-800 border-blue-300 shadow-sm"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
            {s.label}
            <span className={`ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
              isActive ? "bg-blue-700 text-white" : "bg-white text-blue-800 border border-blue-300"
            }`}>{counts[s.key] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
};

const OrdersTable = ({ data, onView, onUpdateStatus }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-blue-200 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-blue-100 text-blue-900 text-sm font-medium">
        <div className="col-span-2">Mã đơn</div>
        <div className="col-span-3">Khách hàng</div>
        <div className="col-span-2">Ngày tạo</div>
        <div className="col-span-1 text-right">SL</div>
        <div className="col-span-2 text-right">Tổng tiền</div>
        <div className="col-span-2 text-right">Trạng thái</div>
      </div>
      <ul className="divide-y divide-blue-100">
        {data.map((o) => (
          <li key={o.id} className="px-4 md:px-6 py-4 hover:bg-blue-50/40 transition">
            <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-2 md:gap-4">
              <div className="md:col-span-2 font-medium text-blue-900">{o.id}</div>
              <div className="md:col-span-3">
                <div className="text-slate-800 font-medium">{o.customer}</div>
                <div className="text-slate-500 text-sm">{o.phone} • {o.address}</div>
              </div>
              <div className="md:col-span-2 text-slate-600">{o.date}</div>
              <div className="md:col-span-1 text-right text-slate-600">{o.itemsCount}</div>
              <div className="md:col-span-2 text-right font-semibold text-slate-800">{currency(o.total)}</div>
              <div className="md:col-span-2 flex md:justify-end items-center gap-2">
                <StatusBadge status={o.status} />
                <button
                  onClick={() => onView(o)}
                  className="inline-flex items-center justify-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded-full hover:bg-blue-100"
                >
                  <Eye size={16} /> Chi tiết
                </button>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === o.id ? null : o.id)}
                    className="inline-flex items-center justify-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium px-2.5 py-1.5 rounded-full hover:bg-slate-100"
                  >
                    Cập nhật <ChevronDown size={14} />
                  </button>
                  {openMenuId === o.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg ring-1 ring-blue-200 overflow-hidden z-10">
                      <button
                        onClick={() => {
                          onUpdateStatus(o, "processing");
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} className="text-blue-700" /> Đang xử lý
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(o, "shipped");
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                      >
                        <Truck size={16} className="text-blue-800" /> Đã gửi
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(o, "cancelled");
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                      >
                        <XCircle size={16} className="text-rose-600" /> Hủy đơn
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const OrderDetail = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-xl ring-1 ring-blue-200 rounded-l-2xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Chi tiết đơn {order.id}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Đóng</button>
        </div>
        <div className="mt-5 space-y-5">
          <section className="bg-blue-50/80 rounded-xl p-4">
            <div className="font-medium text-blue-900">Khách hàng</div>
            <div className="text-sm text-slate-600">{order.customer} • {order.phone}</div>
            <div className="text-sm text-slate-600">{order.address}</div>
          </section>
          <section className="rounded-xl ring-1 ring-blue-200 p-4">
            <div className="font-medium text-blue-900">Sản phẩm</div>
            <ul className="mt-2 space-y-2">
              {order.items.map((it, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">{it.name} x{it.qty}</span>
                  <span className="font-medium text-slate-900">{currency(it.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between items-center border-t pt-3 text-sm">
              <span className="text-slate-600">Tổng cộng</span>
              <span className="font-semibold text-slate-900">{currency(order.total)}</span>
            </div>
          </section>
          {order.note && (
            <section className="rounded-xl ring-1 ring-blue-200 p-4">
              <div className="font-medium text-blue-900">Ghi chú</div>
              <p className="text-sm text-slate-600 mt-1">{order.note}</p>
            </section>
          )}
          
          <div className="pt-4">
            <button 
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800 flex items-center justify-center"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [active, setActive] = useState("all");
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const inStatus = (status === "all" || o.status === status) && (active === "all" || o.status === active);
      const s = search.trim().toLowerCase();
      const inSearch = !s || [o.id, o.customer, o.phone, o.address].join(" ").toLowerCase().includes(s);
      return inStatus && inSearch;
    });
  }, [orders, search, status, active]);

  const counts = useMemo(() => {
    const map = { all: orders.length };
    for (const st of ["pending","processing","shipped","delivered","cancelled"]) {
      map[st] = orders.filter((o) => o.status === st).length;
    }
    return map;
  }, [orders]);

  const handleUpdateStatus = (order, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
  };

  const handleRefresh = () => {
    // Placeholder for future API refresh. For now, just a gentle pulse effect by triggering state.
    setOrders((prev) => [...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <OrdersHeader onRefresh={handleRefresh} total={orders.length} />
      <FiltersBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
      <StatusTabs active={active} setActive={setActive} counts={counts} />

      <OrdersTable data={filtered} onView={(o) => setViewing(o)} onUpdateStatus={handleUpdateStatus} />

      <OrderDetail order={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};

export default Order;