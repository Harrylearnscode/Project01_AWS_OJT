"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import OrderService from "../../../api/service/Order.service"

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY: "bg-green-100 text-green-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function OrderDetailModal({ isOpen, order, onClose, onStatusUpdate, availableStatuses }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderData, setOrderData] = useState(order)

  useEffect(() => {
    if (isOpen && order?.orderId) {
      fetchOrderDetails()
    }
  }, [isOpen, order?.orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await OrderService.getOrderDetail(order.orderId)
      setOrderData(data)
      setSelectedStatus(data.status)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order details")
      console.error("Error fetching order details:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-6 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Error</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const displayOrder = orderData || order

  const handleStatusChange = async (newStatus) => {
    if (newStatus === displayOrder.status) return

    try {
      setIsUpdating(true)
      await onStatusUpdate(displayOrder.orderId, newStatus)
      setSelectedStatus(newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Order #{displayOrder.orderId}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Order Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedStatus] || "bg-gray-100 text-gray-800"}`}
              >
                {selectedStatus}
              </span>
            </div>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer disabled:opacity-50"
              >
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground/70 mb-1">Customer Name</p>
              <p className="text-foreground font-medium">{displayOrder.userName}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground/70 mb-1">Phone Number</p>
              <p className="text-foreground font-medium">{displayOrder.phoneNumber || "N/A"}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground/70 mb-1">Order Date</p>
              <p className="text-foreground font-medium">{formatDate(displayOrder.orderTime)}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground/70 mb-1">Completed Date</p>
              <p className="text-foreground font-medium">{formatDate(displayOrder.endTime)}</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground/70 mb-2">Delivery Address</p>
            <p className="text-foreground">{displayOrder.address}</p>
          </div>

          {/* Pricing */}
          <div className="bg-background rounded-lg p-4 border border-border space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ingredients Price:</span>
              <span className="text-foreground font-medium">${(displayOrder.ingredientsPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Price:</span>
              <span className="text-foreground font-medium">${displayOrder.deliveryPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-foreground font-semibold">Total Price:</span>
              <span className="text-foreground font-bold text-lg">${displayOrder.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Dishes */}
          {displayOrder.dishes && displayOrder.dishes.length > 0 && (
            <div className="bg-background rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Dishes</h3>
              <div className="space-y-4">
                {displayOrder.dishes.map((dish) => (
                  <div key={dish.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-4 mb-2">
                      {dish.imgUrl && (
                        <img
                          src={dish.imgUrl || "/placeholder.svg"}
                          alt={dish.dishName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{dish.dishName}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {dish.quantity}</p>
                      </div>
                    </div>

                    {/* Ingredients */}
                    {dish.ingredients && dish.ingredients.length > 0 && (
                      <div className="ml-0 mt-2 bg-card rounded p-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Ingredients:</p>
                        <ul className="space-y-1">
                          {dish.ingredients.map((ingredient) => (
                            <li key={ingredient.id} className="text-xs text-muted-foreground">
                              • {ingredient.ingredientName} (x{ingredient.quantity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calories */}
          {/* <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground/70 mb-1">Total Calories</p>
            <p className="text-foreground font-medium">{displayOrder.totalCalories.toFixed(1)} kcal</p>
          </div> */}

          {/* Cancellation Reason */}
          {displayOrder.status === "CANCELLED" && displayOrder.canceledReason && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1">Cancellation Reason</p>
              <p className="text-red-700">{displayOrder.canceledReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
