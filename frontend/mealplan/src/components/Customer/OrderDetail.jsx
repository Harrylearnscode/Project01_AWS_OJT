"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Package, Clock, MapPin, Phone, User, AlertCircle } from "lucide-react"
import  OrderService  from "../../api/service/Order.service.jsx"

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrderDetail()
  }, [orderId])

  const loadOrderDetail = async () => {
    try {
      setLoading(true)
      const orderData = await OrderService.getOrderDetail(orderId)
      setOrder(orderData)
    } catch (error) {
      console.error("Failed to load order detail:", error)
      alert("Không thể tải thông tin đơn hàng")
      navigate("/customer/orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { label: "Chờ xử lý", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
      CONFIRMED: { label: "Đã xác nhận", color: "text-blue-500", bgColor: "bg-blue-500/10" },
      PREPARING: { label: "Đang chuẩn bị", color: "text-orange-500", bgColor: "bg-orange-500/10" },
      DELIVERING: { label: "Đang giao hàng", color: "text-purple-500", bgColor: "bg-purple-500/10" },
      DELIVERED: { label: "Đã giao hàng", color: "text-green-500", bgColor: "bg-green-500/10" },
      CANCELLED: { label: "Đã hủy", color: "text-red-500", bgColor: "bg-red-500/10" },
    }

    return (
      statusMap[status] || {
        label: status,
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
      }
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy đơn hàng</h2>
        <button
          onClick={() => navigate("/customer/odershistory")}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/customer/odershistory")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Đơn hàng #{order.orderId}</h1>
          <p className="text-muted-foreground mt-1">Chi tiết đơn hàng của bạn</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor}`}>
          <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dishes */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Món ăn đã đặt
            </h2>

            <div className="space-y-4">
              {order.dishes.map((dish) => (
                <div key={dish.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{dish.dishName}</h3>
                      <p className="text-sm text-muted-foreground">Số lượng: {dish.quantity}</p>
                    </div>
                  </div>

                  {dish.ingredients && dish.ingredients.length > 0 && (
                    <div className="mt-3 bg-muted/30 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-card-foreground mb-2">Nguyên liệu:</h4>
                      <div className="space-y-1">
                        {dish.ingredients.map((ingredient) => (
                          <div key={ingredient.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{ingredient.ingredientName}</span>
                            <span className="text-card-foreground font-medium">{ingredient.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cancelled Reason */}
          {order.status === "CANCELLED" && order.canceledReason && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h2 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Lý do hủy đơn
              </h2>
              <p className="text-card-foreground">{order.canceledReason}</p>
              {order.canceledAt && (
                <p className="text-sm text-muted-foreground mt-2">Hủy lúc: {formatDate(order.canceledAt)}</p>
              )}
            </div>
          )}
        </div>

        {/* Order Info Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-card-foreground mb-4">Thông tin khách hàng</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Tên khách hàng</p>
                  <p className="text-card-foreground font-medium">{order.userName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="text-card-foreground font-medium">{order.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="text-card-foreground font-medium">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Thời gian
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Thời gian đặt hàng</p>
                <p className="text-card-foreground font-medium">{formatDate(order.orderTime)}</p>
              </div>

              {order.paidTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian thanh toán</p>
                  <p className="text-card-foreground font-medium">{formatDate(order.paidTime)}</p>
                </div>
              )}

              {order.endTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian hoàn thành</p>
                  <p className="text-card-foreground font-medium">{formatDate(order.endTime)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-card-foreground mb-4">Tổng quan giá</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Phí giao hàng</span>
                <span>${order.deliveryPrice.toFixed(2)}</span>
              </div>

              {order.totalCalories > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tổng calories</span>
                  <span>{order.totalCalories.toFixed(0)} kcal</span>
                </div>
              )}

              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-bold text-card-foreground">
                  <span>Tổng cộng</span>
                  <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
