import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Trash,
  Edit,
  Plus,
  Eye,
  Save,
  X,
  RefreshCw,
  Package,
  Tag,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

// Product categories
const CATEGORIES = [
  { key: "all", label: "Tất cả" },
  { key: "Món chính", label: "Món chính" },
  { key: "Khai vị", label: "Khai vị" },
  { key: "Đồ uống", label: "Đồ uống" },
  { key: "Tráng miệng", label: "Tráng miệng" },
];

// Product statuses
const STATUS_OPTIONS = [
  { key: "active", label: "Đang bán", color: "bg-emerald-500" },
  { key: "inactive", label: "Tạm ngừng", color: "bg-slate-400" },
  { key: "out_of_stock", label: "Hết hàng", color: "bg-amber-500" },
];

// Mock data for products
const mockProducts = [
  {
    id: "P-001",
    name: "Cơm gà nướng",
    description: "Cơm gà nướng với sốt đặc biệt, rau xà lách và cà chua bi",
    price: 120000,
    inventory: 25,
    category: "Món chính",
    imageUrl: "https://example.com/images/com-ga-nuong.jpg",
    status: "active",
    createdAt: "2025-09-10",
  },
  {
    id: "P-002",
    name: "Salad cá ngừ",
    description: "Salad tươi với cá ngừ đại dương, sốt mè rang và rau thơm",
    price: 90000,
    inventory: 18,
    category: "Khai vị",
    imageUrl: "https://example.com/images/salad-ca-ngu.jpg",
    status: "active",
    createdAt: "2025-09-12",
  },
  {
    id: "P-003",
    name: "Nước ép cam",
    description: "Nước ép cam tươi 100%, không đường, giàu vitamin C",
    price: 60000,
    inventory: 30,
    category: "Đồ uống",
    imageUrl: "https://example.com/images/nuoc-ep-cam.jpg",
    status: "active",
    createdAt: "2025-09-15",
  },
  {
    id: "P-004",
    name: "Bún thịt nướng",
    description: "Bún với thịt nướng, chả giò, rau sống và nước mắm",
    price: 75000,
    inventory: 10,
    category: "Món chính",
    imageUrl: "https://example.com/images/bun-thit-nuong.jpg",
    status: "active",
    createdAt: "2025-09-18",
  },
  {
    id: "P-005",
    name: "Phở bò",
    description: "Phở bò với nước dùng đậm đà, thịt bò tái và các loại gia vị",
    price: 100000,
    inventory: 5,
    category: "Món chính",
    imageUrl: "https://example.com/images/pho-bo.jpg",
    status: "inactive",
    createdAt: "2025-09-20",
  }
];

// Utility functions
function currency(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

// Status badge component
const StatusBadge = ({ status }) => {
  const statusInfo = STATUS_OPTIONS.find(s => s.key === status) || { 
    label: status, 
    color: "bg-gray-500" 
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center justify-center
      ${status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' :
        status === 'inactive' ? 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200' :
        'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color} mr-1`}></span>
      {statusInfo.label}
    </span>
  );
};

// Header component
const ProductsHeader = ({ onAddNew, onRefresh, total }) => {
  return (
    <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 text-white rounded-2xl p-5 shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Sản phẩm</h1>
          <p className="text-white/80 text-sm">Quản lý danh mục sản phẩm, cập nhật thông tin và tồn kho</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={onAddNew} className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-medium transition">
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-white/80">Tổng số sản phẩm: <span className="font-semibold text-white">{total}</span></div>
    </div>
  );
};

// Filters component
const FiltersBar = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
          <Search size={18} />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên sản phẩm, mô tả..."
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
          <Tag size={18} />
        </span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Products table component
const ProductsTable = ({ data, onView, onEdit, onUpdateInventory, onToggleStatus }) => {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-blue-200 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-blue-100 text-blue-900 text-sm font-medium">
        <div className="col-span-3">Sản phẩm</div>
        <div className="col-span-2">Danh mục</div>
        <div className="col-span-2 text-right">Giá bán</div>
        <div className="col-span-2 text-right">Tồn kho</div>
        <div className="col-span-1">Trạng thái</div>
        <div className="col-span-2 text-right">Hành động</div>
      </div>
      <ul className="divide-y divide-blue-100">
        {data.map((p) => (
          <li key={p.id} className="px-4 md:px-6 py-4 hover:bg-blue-50/40 transition">
            <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-2 md:gap-4">
              <div className="md:col-span-3">
                <div className="font-medium text-blue-900">{p.name}</div>
                <div className="text-slate-500 text-sm truncate">{p.description}</div>
              </div>
              <div className="md:col-span-2 text-slate-600">{p.category}</div>
              <div className="md:col-span-2 text-right font-semibold text-slate-800">{currency(p.price)}</div>
              <div className="md:col-span-2 text-right">
                <div className={`font-medium ${p.inventory < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                  {p.inventory} sản phẩm
                </div>
                <div className="flex justify-end gap-2 mt-1">
                  <button 
                    onClick={() => onUpdateInventory(p, -1)}
                    disabled={p.inventory <= 0}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      p.inventory <= 0 
                        ? 'bg-slate-100 text-slate-400' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >-</button>
                  <button 
                    onClick={() => onUpdateInventory(p, 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >+</button>
                </div>
              </div>
              <div className="md:col-span-1">
                <StatusBadge status={p.status} />
              </div>
              <div className="md:col-span-2 flex md:justify-end items-center gap-2">
                <button
                  onClick={() => onView(p)}
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded-full hover:bg-blue-100"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => onEdit(p)}
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded-full hover:bg-blue-100"
                >
                  <Edit size={16} />
                </button>
                <div className="relative group">
                  <button className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium px-2 py-1 rounded-full hover:bg-slate-100">
                    <MoreHorizontal size={16} />
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg ring-1 ring-blue-200 overflow-hidden z-10">
                    <button
                      onClick={() => onToggleStatus(p)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                    >
                      {p.status === "active" ? (
                        <>Tạm ngừng bán</>
                      ) : (
                        <>Mở bán lại</>
                      )}
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash size={16} /> Xóa sản phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Product detail component
const ProductDetail = ({ product, onClose }) => {
  if (!product) return null;
  
  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-xl ring-1 ring-blue-200 rounded-l-2xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Chi tiết sản phẩm</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Đóng</button>
        </div>
        
        <div className="mt-5 space-y-6">
          <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center">
            <Package size={64} className="text-slate-400" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-blue-900">{product.name}</h2>
            <span className="inline-block mt-1 text-sm px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
              {product.category}
            </span>
            <p className="mt-3 text-slate-600">{product.description}</p>
          </div>
          
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã sản phẩm:</span>
              <span className="font-medium text-slate-800">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giá bán:</span>
              <span className="font-semibold text-slate-900">{currency(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tồn kho:</span>
              <span className={`font-medium ${product.inventory < 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                {product.inventory} sản phẩm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái:</span>
              <StatusBadge status={product.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ngày tạo:</span>
              <span className="text-slate-700">{product.createdAt}</span>
            </div>
          </div>
          
          <div className="pt-4 flex gap-2">
            <button 
              onClick={() => {
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-medium hover:bg-blue-50"
            >
              Đóng
            </button>
            <button 
              className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product edit form component
const ProductEditForm = ({ product, onSave, onCancel }) => {
  const emptyProduct = {
    id: "P-" + (Math.floor(Math.random() * 900) + 100),
    name: "",
    description: "",
    price: 0,
    inventory: 0,
    category: CATEGORIES[1].key,
    imageUrl: "",
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  
  const [form, setForm] = useState(product || emptyProduct);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert price and inventory to numbers
    if (name === "price" || name === "inventory") {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };
  
  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onCancel}></div>
      <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-xl ring-1 ring-blue-200 rounded-l-2xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              placeholder="Nhập mô tả chi tiết về sản phẩm"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                {CATEGORIES.filter(c => c.key !== "all").map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Nhập giá bán"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tồn kho <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="inventory"
                value={form.inventory}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="Nhập số lượng tồn kho"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Đường dẫn hình ảnh
            </label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              placeholder="Nhập đường dẫn hình ảnh sản phẩm"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Lưu sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Product = () => {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Filter products based on search term and category
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const s = search.toLowerCase().trim();
      const matchesSearch = !s || 
        p.name.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s);
      
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  // Handlers
  const handleRefresh = () => {
    setProducts([...mockProducts]);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditing(null);
    setViewing(null);
  };

  const handleUpdateInventory = (product, change) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === product.id 
          ? {...p, inventory: Math.max(0, p.inventory + change)} 
          : p
      )
    );
  };

  const handleToggleStatus = (product) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === product.id 
          ? {...p, status: p.status === "active" ? "inactive" : "active"} 
          : p
      )
    );
  };
  
  const handleSaveProduct = (formData) => {
    // If editing an existing product
    if (editing) {
      setProducts(prev => prev.map(p => p.id === formData.id ? formData : p));
    } 
    // If adding a new product
    else {
      setProducts(prev => [...prev, formData]);
    }
    
    // Close the form
    setEditing(null);
    setIsAddingNew(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <ProductsHeader 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh} 
        total={products.length} 
      />
      
      <FiltersBar 
        search={search} 
        setSearch={setSearch} 
        category={category} 
        setCategory={setCategory} 
      />

      <ProductsTable 
        data={filtered}
        onView={(p) => {
          setViewing(p);
          setEditing(null);
          setIsAddingNew(false);
        }}
        onEdit={(p) => {
          setEditing(p);
          setViewing(null);
          setIsAddingNew(false);
        }}
        onUpdateInventory={handleUpdateInventory}
        onToggleStatus={handleToggleStatus}
      />
      
      {viewing && (
        <ProductDetail 
          product={viewing} 
          onClose={() => setViewing(null)} 
        />
      )}
      
      {(editing || isAddingNew) && (
        <ProductEditForm 
          product={editing}
          onSave={handleSaveProduct}
          onCancel={() => {
            setEditing(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
};

export default Product;