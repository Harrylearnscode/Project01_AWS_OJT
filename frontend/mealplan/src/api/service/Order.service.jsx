import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const OrderService = {
  getAllOrders: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.ORDER.GET_ALL_ORDERS)
    return response.data
  },
  
  getOrdersByUser: async (userId) => {
    const response = await axiosInstance.get(APIENDPOINTS.ORDER.GET_ORDERS_BY_USER.replace('{userId}', userId))
    return response.data
  },
  
  createOrder: async (orderData) => {
    const response = await axiosInstance.post(APIENDPOINTS.ORDER.CREATE_ORDER, orderData)
    return response.data
  },
  
  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(
      `${APIENDPOINTS.ORDER.UPDATE_ORDER_STATUS.replace('{orderId}', orderId)}?status=${status}`
    )
    return response.data
  },
  
  cancelOrder: async (orderId) => {
    const response = await axiosInstance.delete(APIENDPOINTS.ORDER.CANCEL_ORDER.replace('{orderId}', orderId))
    return response.data
  }
}

export default OrderService