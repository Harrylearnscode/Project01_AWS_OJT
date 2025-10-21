"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown } from "lucide-react"
import OrderStats from "./OrderComponent/OrderStatus"
import OrderList from "./OrderComponent/OrderList"
import OrderDetailModal from "./OrderComponent/OrderDetailModal"
// import { getOrders, updateOrderStatus } from "../../api/service/Order.service.jsx"
import OrderService from "../../api/service/Order.service.jsx"

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]

export default function Order() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchId, setSearchId] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders()
  }, [])

  // Filter orders when search or filter changes
  useEffect(() => {
    let filtered = orders

    // Filter by order ID
    if (searchId.trim()) {
      filtered = filtered.filter((order) => order.orderId.toString().includes(searchId.trim()))
    }

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === filterStatus)
    }

    setFilteredOrders(filtered)
  }, [orders, searchId, filterStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await OrderService.getAllOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus)
      // Update local state
      setOrders(orders.map((order) => (order.orderId === orderId ? { ...order, status: newStatus } : order)))
      // Close modal if it was open
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status")
      console.error("Error updating order:", err)
    }
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>

        {/* Stats */}
        <OrderStats orders={orders} />

        {/* Search and Filter Section */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search by Order ID */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter by Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6 text-destructive">
            {error}
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading orders...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <OrderList orders={filteredOrders} onOrderClick={handleOrderClick} onStatusUpdate={handleStatusUpdate} />
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            isOpen={isModalOpen}
            order={selectedOrder}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedOrder(null)
            }}
            onStatusUpdate={handleStatusUpdate}
            availableStatuses={ORDER_STATUSES}
          />
        )}
      </div>
    </div>
  )
}
