import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const OrderService = {
    createOrder: async (orderData) => {
        const response = await axiosInstance.post(APIENDPOINTS.ORDER.CREATE_ORDER, orderData)
        console.log("OrderService -> createOrder -> response", response.data)
        return response.data
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
    cancelOrder: async (orderId, reason) => {
        if (!orderId) {
            throw new Error("Order ID is required")
        }
        const response = await axiosInstance.post(APIENDPOINTS.ORDER.CANCEL_ORDER(orderId), { reason })
        console.log("OrderService -> cancelOrder -> response", response.data)
        return response.data.data
    }
}
export default OrderService