import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const OrderService = {
    createOrder: async (orderData) => {
        const response = await axiosInstance.post(APIENDPOINTS.ORDER.CREATE_ORDER, orderData)
        console.log("OrderService -> createOrder -> response", response.data)
        return response.data
    }
}
export default OrderService