"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Package, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import OrderService from "../../api/service/Order.service.jsx"

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelingOrderId, setCancelingOrderId] = useState(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("currentUser"))

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await OrderService.getUserOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Failed to load orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation()

    const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:")
    if (!reason || !reason.trim()) {
      return
    }

    try {
      setCancelingOrderId(orderId)
      await OrderService.cancelOrder(orderId, user.id, reason.trim())

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.orderId === orderId ? { ...order, status: "CANCELLED" } : order)),
      )

      alert("Đơn hàng đã được hủy thành công")
    } catch (error) {
      console.error("Failed to cancel order:", error)
      alert("Không thể hủy đơn hàng. Vui lòng thử lại.")
    } finally {
      setCancelingOrderId(null)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: {
        label: "Chờ xử lý",
        icon: Clock,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        icon: CheckCircle,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      PREPARING: {
        label: "Đang chuẩn bị",
        icon: Package,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      DELIVERING: {
        label: "Đang giao hàng",
        icon: Package,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      DELIVERED: {
        label: "Đã giao hàng",
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      CANCELLED: {
        label: "Đã hủy",
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
    }

    return (
      statusMap[status] || {
        label: status,
        icon: AlertCircle,
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
      }
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canCancelOrder = (status) => {
    return ["PENDING", "CONFIRMED"].includes(status)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Chưa có đơn hàng nào</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món yêu thích của bạn!
        </p>
        <button
          onClick={() => navigate("/customer/customerShop")}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Xem thực đơn
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Lịch sử đơn hàng</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi đơn hàng của bạn</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          const StatusIcon = statusInfo.icon
          return (
            <div
              key={order.orderId}
              onClick={() => navigate(`/customer/odersdetail/${order.orderId}`)}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-card-foreground">Đơn hàng #{order.orderId}</h3>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Đặt lúc: {formatDate(order.orderTime)}</span>
                    </div>
                    <div>Địa chỉ: {order.address}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-primary">${order.totalPrice.toFixed(2)}</div>
                    {order.totalCalories > 0 && (
                      <div className="text-sm text-muted-foreground">{order.totalCalories.toFixed(0)} kcal</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/customer/odersdetail/${order.orderId}`)
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Xem chi tiết
                  </button>

                  {canCancelOrder(order.status) && (
                    <button
                      onClick={(e) => handleCancelOrder(order.orderId, e)}
                      disabled={cancelingOrderId === order.orderId}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelingOrderId === order.orderId ? "Đang hủy..." : "Hủy đơn"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderHistory
