"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { fetchMealDetail } from "../../data/mockMeal"

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedCart = localStorage.getItem("mealplan-cart")
        const cartData = savedCart ? JSON.parse(savedCart) : []

        if (cartData.length === 0) {
          setLoading(false)
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
  }, [])

  const saveCartToStorage = (items) => {
    const cartData = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }))
    localStorage.setItem("mealplan-cart", JSON.stringify(cartData))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedItems)
    saveCartToStorage(updatedItems)
  }

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedItems)
    saveCartToStorage(updatedItems)
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-8 bg-muted rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border p-6 h-fit">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded"></div>
              </div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Bạn chưa có món ăn nào trong giỏ hàng. Hãy khám phá thực đơn của chúng tôi và thêm những món ăn yêu thích!
        </p>
        <Link
          to="/customer/customerShop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Xem thực đơn
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/customer/customerShop" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Giỏ hàng của bạn</h1>
        <span className="text-muted-foreground">({cartItems.length} món)</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold text-primary">${item.price}</div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-sm text-muted-foreground line-through">${item.originalPrice}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Thời gian: {item.prepTime}</span>
                    <span>Khẩu phần: {item.servings}</span>
                    <span className="px-2 py-1 bg-muted rounded-full">{item.category}</span>
                    <span className="px-2 py-1 bg-muted rounded-full">{item.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Tóm tắt đơn hàng</h2>

          <div className="space-y-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} món)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Phí giao hàng</span>
              <span>
                {deliveryFee === 0 ? <span className="text-green-500">Miễn phí</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            {subtotal < 50 && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                Thêm ${(50 - subtotal).toFixed(2)} để được miễn phí giao hàng
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold text-card-foreground">
                <span>Tổng cộng</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/customer/checkout")}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6"
            >
              Tiến hành thanh toán
            </button>

            <Link
              to="/customer/customerShop"
              className="block text-center text-muted-foreground hover:text-foreground transition-colors text-sm mt-4"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart
