import React, { useMemo, useState, useEffect } from "react";
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
  Utensils
} from "lucide-react";
import DishService from "../../api/service/Dish.service.jsx";
import DishIngredientService from "../../api/service/DishIngredient.service.jsx";
import RecipeIngredientEditor from "./RecipeIngredientEditor.jsx";

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
const ProductsTable = ({ data, onView, onEdit, onToggleStatus }) => {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-blue-200 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-blue-100 text-blue-900 text-sm font-medium">
        <div className="col-span-4">Sản phẩm</div>
        <div className="col-span-3">Danh mục</div>
        <div className="col-span-3 text-right">Giá bán</div>
        <div className="col-span-2 text-right">Hành động</div>
      </div>
      <ul className="divide-y divide-blue-100">
        {data.map((p) => (
          <li key={p.id} className="px-4 md:px-6 py-4 hover:bg-blue-50/40 transition">
            <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-2 md:gap-4">
              <div className="md:col-span-4">
                <div className="font-medium text-blue-900">{p.name}</div>
                <div className="text-slate-500 text-sm truncate">{p.description}</div>
              </div>
              <div className="md:col-span-3 text-slate-600">{p.category}</div>
              <div className="md:col-span-3 text-right font-semibold text-slate-800">{currency(p.price)}</div>
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
                <button
                  onClick={() => onToggleStatus(p)}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium px-2 py-1 rounded-full hover:bg-slate-100"
                  title={p.status === "active" ? "Tạm ngừng bán" : "Mở bán lại"}
                >
                  {p.status === "active" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </button>
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
const ProductEditForm = ({ product, onSave, onDelete, onCancel }) => {
  const emptyProduct = {
    name: "",
    description: "",
    price: 0,
    category: CATEGORIES[1].key,
    imageUrl: "",
    status: "active", // Kept for backend compatibility
  };
  
  const [form, setForm] = useState(product || emptyProduct);
  const [showIngredientEditor, setShowIngredientEditor] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch ingredients when editing an existing product
  useEffect(() => {
    if (product && product.id) {
      const fetchExistingIngredients = async () => {
        try {
          console.log("Fetching ingredients for product:", product.id);
          const response = await DishIngredientService.getDishIngredientsByDishId(product.id);
          console.log("Got ingredient response:", response);
          if (response && response.data) {
            console.log("Setting ingredients from fetched data");
            setIngredients(response.data);
          }
        } catch (error) {
          console.error("Error loading ingredients:", error);
        }
      };
      
      fetchExistingIngredients();
    }
  }, [product]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert price to number
    if (name === "price") {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    
    setIsSaving(true);
    try {
      // First save the product
      const savedProduct = await onSave(form);
      console.log("Product saved successfully:", savedProduct);
      
      // Then, if we have ingredients, save them
      if (ingredients.length > 0 && savedProduct && savedProduct.id) {
        try {
          // Delete existing ingredients
          console.log("Handling ingredients for saved product:", savedProduct.id);
          const existingIngredients = await DishIngredientService.getDishIngredientsByDishId(savedProduct.id);
          console.log("Existing ingredients:", existingIngredients);
          
          if (existingIngredients && existingIngredients.data) {
            console.log("Deleting existing ingredients before saving new ones");
            for (const ingredient of existingIngredients.data) {
              await DishIngredientService.deleteDishIngredient(ingredient.id);
            }
          }
          
          // Save new ingredients
          console.log("Saving new ingredients:", ingredients);
          for (const ingredient of ingredients) {
            const ingredientData = {
              name: ingredient.name || ingredient.ingredient?.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              dishId: savedProduct.id
            };
            
            console.log("Saving ingredient:", ingredientData);
            await DishIngredientService.createDishIngredient(ingredientData);
          }
          console.log("All ingredients saved successfully");
        } catch (error) {
          console.error("Error saving ingredients:", error);
          alert("Sản phẩm đã được lưu nhưng có lỗi khi lưu nguyên liệu");
        }
      }
      
      // Display success message
      alert("Sản phẩm đã được lưu thành công!");
      
      // Close the form
      onCancel();
    } catch (error) {
      console.error("Error in form submission:", error);
      alert("Không thể lưu sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
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
          
          <div>
            <button
              type="button"
              onClick={() => setShowIngredientEditor(prev => !prev)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-blue-500 text-blue-700 rounded-xl hover:bg-blue-50"
            >
              <Utensils size={16} />
              {showIngredientEditor ? "Ẩn công thức" : "Chỉnh sửa công thức món ăn"}
            </button>
          </div>
          
          {showIngredientEditor && (
            <RecipeIngredientEditor
              dishId={form.id}
              onSave={(ingredientData) => {
                setIngredients(ingredientData);
                setShowIngredientEditor(false);
              }}
              onCancel={() => setShowIngredientEditor(false)}
            />
          )}
          
          {/* Actions */}
          <div className="pt-4">
            {/* Delete option for existing products */}
            {product && onDelete && (
              <div className="mb-4">
                <button 
                  type="button"
                  onClick={onDelete}
                  disabled={isSaving}
                  className={`w-full py-2.5 rounded-xl bg-white border border-red-300 text-red-600 font-medium flex items-center justify-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
                >
                  <Trash size={18} />
                  Xóa sản phẩm
                </button>
              </div>
            )}
            
            {/* Save/Cancel buttons */}
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className={`flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className={`flex-1 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${isSaving ? 'bg-blue-500' : 'bg-blue-700 hover:bg-blue-800'}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Lưu sản phẩm
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await DishService.getAllActiveDishes();
      console.log("Fetch products response:", response);
      
      // DishService returns response.data, which should be an array
      if (response && response.data && Array.isArray(response.data)) {
        const formattedProducts = response.data.map(dish => ({
          id: dish.dishId?.toString() || dish.id?.toString(),
          name: dish.name,
          description: dish.description,
          price: dish.price,
          category: dish.category || dish.countryName || "Món chính",
          imageUrl: dish.imageUrl || dish.imgUrl,
          status: dish.status || "active",
          createdAt: dish.createdAt || new Date().toISOString().split("T")[0]
        }));
        setProducts(formattedProducts);
        console.log("Products formatted and ready for display:", formattedProducts.length);
      } else {
        console.warn("No valid data in response:", response);
        setProducts([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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
    fetchProducts();
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditing(null);
    setViewing(null);
  };

  // handleUpdateInventory function removed as per requirements

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === "active" ? "inactive" : "active";
      console.log(`Toggling status for product ID ${product.id} from ${product.status} to ${newStatus}`);
      
      // Convert product to backend format
      const dishData = {
        ...product,
        dishId: Number(product.id),
        imgUrl: product.imageUrl,
        countryName: product.category,
        typeNames: [product.category],
        status: newStatus
      };
      
      console.log("Sending toggle status data:", dishData);
      
      // Send update to backend
      const response = await DishService.updateDish(product.id, dishData);
      console.log("Toggle status API response:", response);
      
      if (response) {
        console.log("Successfully toggled status, received:", response);
        
        // Update local state if API call succeeded
        setProducts(prev => 
          prev.map(p => 
            p.id === product.id 
              ? {...p, status: newStatus} 
              : p
          )
        );
      } else {
        console.error("Toggle status API returned empty response");
        alert("API returned empty response when updating product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại sau.");
    }
  };
  
  const handleDeleteProduct = async (product) => {
    try {
      console.log(`Deleting product with ID: ${product.id}`);
      
      const response = await DishService.deleteDish(product.id);
      console.log("Delete API response:", response);
      
      // Response will be the data directly since we modified the service
      console.log("Successfully deleted product");
      
      // Update local state if API call succeeded
      setProducts(prev => prev.filter(p => p.id !== product.id));
      
      // Clear confirm state
      setConfirmDelete(null);
      
      // Close edit form if open
      setEditing(null);
      
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      return false;
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      let savedProduct = null;
      
      // If editing an existing product
      if (editing) {
        console.log("Updating existing product with ID:", formData.id);
        
        // Convert formData to backend format
        const dishData = {
          ...formData,
          dishId: Number(formData.id),
          imgUrl: formData.imageUrl,
          countryName: formData.category,
          typeNames: [formData.category]
        };
        
        console.log("Sending update data:", dishData);
        const response = await DishService.updateDish(formData.id, dishData);
        console.log("Update API response:", response);
        
        if (response) {
          console.log("Successfully updated product, received:", response);
          // Format the updated product for the UI
          const updatedProduct = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            imageUrl: formData.imageUrl,
            status: formData.status || "active",
            createdAt: formData.createdAt
          };
          
          // Update local state with updated product
          setProducts(prev => prev.map(p => p.id === formData.id ? updatedProduct : p));
          savedProduct = updatedProduct;
        } else {
          console.error("Update API returned empty response");
          alert("API returned empty response when updating product");
          return null;
        }
      } 
      // If adding a new product
      else {
        console.log("Creating new product:", formData.name);
        
        // Convert formData to backend format
        const dishData = {
          ...formData,
          imgUrl: formData.imageUrl,
          countryName: formData.category,
          typeNames: [formData.category]
        };
        
        console.log("Sending create data:", dishData);
        const response = await DishService.createDish(dishData);
        console.log("Create API response:", response);
        
        if (response) {
          console.log("Successfully created product, received:", response);
          // Format the new product for the UI
          const newProduct = {
            id: response.dishId?.toString() || response.id?.toString(),
            name: response.name,
            description: response.description,
            price: response.price,
            category: response.category || response.countryName || "Món chính",
            imageUrl: response.imageUrl || response.imgUrl,
            status: response.status || "active",
            createdAt: response.createdAt || new Date().toISOString().split("T")[0]
          };
          setProducts(prev => [...prev, newProduct]);
          savedProduct = newProduct;
        } else {
          console.error("Create API returned empty response");
          alert("API returned empty response when creating product");
          return null;
        }
      }
      
      // Close the form
      setEditing(null);
      setIsAddingNew(false);
      
      // Return the saved product for the ingredient save operation
      return savedProduct;
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Không thể lưu sản phẩm. Vui lòng thử lại sau.");
      return null;
    }
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

      {error && (
        <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
          <button 
            className="mt-2 text-sm font-medium text-rose-600 hover:text-rose-800"
            onClick={handleRefresh}
          >
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-blue-200 p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Đang tải dữ liệu sản phẩm...</p>
        </div>
      ) : (
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
          onToggleStatus={handleToggleStatus}
        />
      )}
      
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
          onDelete={editing ? () => setConfirmDelete(editing) : null}
          onCancel={() => {
            setEditing(null);
            setIsAddingNew(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-30">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setConfirmDelete(null)}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-slate-700">
              Bạn có chắc chắn muốn xóa sản phẩm <span className="font-semibold">{confirmDelete.name}</span>? 
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="mt-6 flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmDelete(null)} 
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button 
                onClick={() => handleDeleteProduct(confirmDelete)} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash size={16} /> Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;