import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const OrderService = {
    createOrder: async (orderData) => {
        const response = await axiosInstance.post(APIENDPOINTS.ORDER.CREATE_ORDER, orderData)
        console.log("OrderService -> createOrder -> response", response.data)
        return response.data.data
    },
    getUserOrders: async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"))
        if (!currentUser || !currentUser.id) {
            throw new Error("User not logged in")
        }

        const response = await axiosInstance.get(APIENDPOINTS.ORDER.GET_ALL_CUSTOMER_ORDERS(currentUser.id))
        console.log("OrderService -> getUserOrders -> response", response.data)
        return response.data.data
    },
    getOrderDetail: async (orderId) => {
        if (!orderId) {
            throw new Error("Order ID is required")
        }
        const response = await axiosInstance.get(APIENDPOINTS.ORDER.GET_ORDER_DETAIL(orderId))
        console.log("OrderService -> getOrderDetail -> response", response.data)
        return response.data.data
    },
    cancelOrder: async (orderId, userid, reason) => {
        if (!orderId) {
            throw new Error("Order ID is required")
        }
        const response = await axiosInstance.put(APIENDPOINTS.ORDER.CANCEL_ORDER(orderId,userid), { reason })
        console.log("OrderService -> cancelOrder -> response", response.data)
        return response.data.data
    },
    getOrderStatus: async (orderId) => {
        if (!orderId) {
            throw new Error("Order ID is required")
        }
        const response = await axiosInstance.get(APIENDPOINTS.ORDER.GET_ORDER_STATUS(orderId))
        console.log("OrderService -> getOrderStatus -> response", response.data)
        return response.data.data
    },
    
    getAllOrders: async () => {
        const response = await axiosInstance.get(APIENDPOINTS.ORDER.GET_ALL_ORDER)
        console.log("OrderService -> getAllOrders -> response", response.data.data)
        return response.data.data
    },
    updateOrderStatus: async (orderId, status) => {
        if (!orderId) {
            throw new Error("Order ID is required")
        }
        const response = await axiosInstance.put(APIENDPOINTS.ORDER.UPDATE_ORDER_STATUS(orderId, status))
        console.log("OrderService -> updateOrderStatus -> response", response.data.data)
        return response.data.data
    }
}
export default OrderService