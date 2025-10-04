"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import CartService from "../../api/service/Cart.service.jsx"

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [itemPrices, setItemPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDish, setSelectedDish] = useState(null)
  const [dishIngredients, setDishIngredients] = useState([])
  const [showIngredientsModal, setShowIngredientsModal] = useState(false)
  const [loadingIngredients, setLoadingIngredients] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const [updatingItemId, setUpdatingItemId] = useState(null)
  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const items = await CartService.getAllCartItems(user.id)
      setCartItems(items)

      if (items.length > 0) {
        const prices = {}
        await Promise.all(
          items.map(async (item) => {
            const price = await CartService.getMealPrice(item.id)
            prices[item.dishId] = price
          }),
        )
        setItemPrices(prices)
      }
    } catch (error) {
      console.error("Failed to load cart items:", error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartDishId, newQuantity) => {
  if (newQuantity < 1) return
  setUpdatingItemId(cartDishId)

  try {
    await CartService.updateCartItem(cartDishId, newQuantity)
    await loadCartItems()
  } catch (error) {
    console.error("Failed to update quantity:", error)
  } finally {
    setUpdatingItemId(null)
  }
}

  const removeItem = async (dishId) => {
    try {
      // Optimistic update
      const updatedItems = cartItems.filter((item) => item.dishId !== dishId)
      setCartItems(updatedItems)

      // Call API to remove
      await CartService.removeCartItem(dishId)

      // Remove price from state
      const updatedPrices = { ...itemPrices }
      delete updatedPrices[dishId]
      setItemPrices(updatedPrices)
    } catch (error) {
      console.error("Failed to remove item:", error)
      // Revert on error
      loadCartItems()
    }
  }

  const showDishIngredients = async (item) => {
    try {
      setSelectedDish(item)
      setShowIngredientsModal(true)
      setLoadingIngredients(true)

      const ingredients = await CartService.getCartDishIngredients(item.id)
      setDishIngredients(ingredients)
    } catch (error) {
      console.error("Failed to load ingredients:", error)
      setDishIngredients([])
    } finally {
      setLoadingIngredients(false)
    }
  }

  const closeIngredientsModal = () => {
    setShowIngredientsModal(false)
    setSelectedDish(null)
    setDishIngredients([])
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = itemPrices[item.dishId] || 0
    return sum + price * item.quantity
  }, 0)

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
    <>
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
            {cartItems.map((item) => {
              const price = itemPrices[item.dishId] || 0
              return (
                <div
                  key={item.id}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <button
                          onClick={() => showDishIngredients(item)}
                          className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors text-left line-clamp-2"
                        >
                          {item.dishName}
                        </button>
                        <button
                          onClick={() => removeItem(item.dishId)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Xóa khỏi giỏ hàng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">Nhấn vào tên món để xem nguyên liệu</p>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">${price.toFixed(2)}</div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                      <div className="mt-3 text-sm text-muted-foreground">
                        Tổng:{" "}
                        <span className="font-semibold text-foreground">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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

      {showIngredientsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-card-foreground">{selectedDish?.dishName} - Nguyên liệu</h2>
              <button
                onClick={closeIngredientsModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingIngredients ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center animate-pulse">
                      <div className="h-5 bg-muted rounded w-1/2"></div>
                      <div className="h-5 bg-muted rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : dishIngredients.length > 0 ? (
                <div className="space-y-3">
                  {dishIngredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex justify-between items-center py-3 border-b border-border last:border-0"
                    >
                      <span className="text-foreground font-medium">{ingredient.ingredientName}</span>
                      <span className="text-muted-foreground">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Không có thông tin nguyên liệu</div>
              )}
            </div>

            <div className="p-6 border-t border-border">
              <button
                onClick={closeIngredientsModal}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ShoppingCart
