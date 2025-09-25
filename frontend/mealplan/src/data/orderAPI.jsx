// Mock API functions for order management

// Mock database to store orders
const orders = []
let orderIdCounter = 1

// Create a new order
export const createOrder = async (orderData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newOrder = {
    id: `ORD${Date.now()}`,
    orderId: orderIdCounter++,
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  orders.push(newOrder)

  console.log("[v0] Order created:", newOrder)
  return newOrder
}

// Update order status
export const updateOrderStatus = async (orderId, status, paymentData = {}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) {
    throw new Error("Order not found")
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    ...paymentData,
    updatedAt: new Date().toISOString(),
  }

  console.log("[v0] Order status updated:", orders[orderIndex])
  return orders[orderIndex]
}

// Get order by ID
export const getOrder = async (orderId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const order = orders.find((order) => order.id === orderId)

  if (!order) {
    throw new Error("Order not found")
  }

  return order
}

// Get all orders (for admin or user history)
export const getOrders = async (filters = {}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredOrders = [...orders]

  if (filters.status) {
    filteredOrders = filteredOrders.filter((order) => order.status === filters.status)
  }

  if (filters.customerId) {
    filteredOrders = filteredOrders.filter(
      (order) => order.customerInfo?.phone === filters.customerId || order.customerInfo?.email === filters.customerId,
    )
  }

  // Sort by creation date (newest first)
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return filteredOrders
}

// Mock payment processing
export const processPayment = async (orderId, paymentMethod = "qr") => {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock payment success (90% success rate)
  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    const paymentData = {
      paymentMethod,
      paymentTime: new Date().toISOString(),
      transactionId: `TXN${Date.now()}`,
      paymentStatus: "completed",
    }

    const updatedOrder = await updateOrderStatus(orderId, "paid", paymentData)
    return { success: true, order: updatedOrder }
  } else {
    await updateOrderStatus(orderId, "payment_failed")
    return { success: false, error: "Payment processing failed" }
  }
}

// Order status constants
export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERING: "delivering",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  PAYMENT_FAILED: "payment_failed",
}
