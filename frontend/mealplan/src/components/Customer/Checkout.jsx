"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, User, CreditCard, Clock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { fetchMealDetail } from "../../data/mockMeal"
import PaymentModal from "./PaymentModal.jsx"

const Checkout = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "qr",
  })
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedCart = localStorage.getItem("mealplan-cart")
        const cartData = savedCart ? JSON.parse(savedCart) : []

        if (cartData.length === 0) {
          navigate("/customer/shoppingCart")
          return
        }

        const detailedItems = await Promise.all(
          cartData.map(async (cartItem) => {
            try {
              const mealDetail = await fetchMealDetail(cartItem.id)
              return {
                ...mealDetail,
                quantity: cartItem.quantity,
              }
            } catch (error) {
              console.error(`Failed to fetch meal ${cartItem.id}:`, error)
              return null
            }
          }),
        )

        const validItems = detailedItems.filter((item) => item !== null)
        setCartItems(validItems)
      } catch (error) {
        console.error("Failed to load cart items:", error)
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ"
    }

    if (!formData.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ giao hàng"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setOrderLoading(true)

    try {
      // Mock API call to create order
      const orderData = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customerInfo: formData,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        status: "pending",
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("[v0] Creating order:", orderData)

      // Show payment modal
      setShowPaymentModal(true)
    } catch (error) {
      console.error("Failed to create order:", error)
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.")
    } finally {
      setOrderLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Clear cart
    localStorage.removeItem("mealplan-cart")

    // Navigate to success page or back to shop
    alert("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.")
    navigate("/customer/customerShop")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 50 ? 0 : 5.99
  const total = subtotal + deliveryFee

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-48"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/customer/shoppingCart" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Thanh toán</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin giao hàng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-card-foreground mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.fullName ? "border-destructive" : "border-border"
                  }`}
                  placeholder="Nhập họ và tên của bạn"
                />
                {formErrors.fullName && <p className="text-destructive text-sm mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.phone ? "border-destructive" : "border-border"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {formErrors.phone && <p className="text-destructive text-sm mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-card-foreground mb-2">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                    formErrors.address ? "border-destructive" : "border-border"
                  }`}
                  placeholder="Nhập địa chỉ chi tiết để giao hàng"
                />
                {formErrors.address && <p className="text-destructive text-sm mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-card-foreground mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Ghi chú thêm cho đơn hàng (nếu có)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-3">Phương thức thanh toán</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={formData.paymentMethod === "qr"}
                      onChange={handleInputChange}
                      className="text-primary focus:ring-primary"
                    />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="text-card-foreground">Thanh toán QR Code</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {orderLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Thanh toán
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-card-foreground mb-6">Đơn hàng của bạn</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-card-foreground line-clamp-2 text-sm">{item.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted-foreground text-sm">x{item.quantity}</span>
                      <span className="font-medium text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Phí giao hàng</span>
                <span>
                  {deliveryFee === 0 ? <span className="text-green-500">Miễn phí</span> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-card-foreground border-t border-border pt-3">
                <span>Tổng cộng</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>Thời gian giao hàng dự kiến: 30-45 phút</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          orderTotal={total}
          orderData={{
            items: cartItems,
            customerInfo: formData,
            total: total,
          }}
        />
      )}
    </div>
  )
}

export default Checkout
