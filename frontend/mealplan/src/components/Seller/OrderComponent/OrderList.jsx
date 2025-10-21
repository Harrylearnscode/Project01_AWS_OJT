"use client"

import { ChevronRight } from "lucide-react"

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY: "bg-green-100 text-green-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function OrderList({ orders, onOrderClick, onStatusUpdate }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.orderId}
          className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onOrderClick(order)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="font-semibold text-foreground">Order #{order.orderId}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs text-muted-foreground/70">Customer</p>
                  <p className="text-foreground">{order.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70">Total Price</p>
                  <p className="text-foreground font-medium">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70">Order Date</p>
                  <p className="text-foreground">{formatDate(order.orderTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70">Address</p>
                  <p className="text-foreground truncate">{order.address}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-4" />
          </div>
        </div>
      ))}
    </div>
  )
}
