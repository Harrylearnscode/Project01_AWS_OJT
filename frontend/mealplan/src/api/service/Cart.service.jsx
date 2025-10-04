import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const CartService = {
    addToCart: async (userId, order) => {
        const response = await axiosInstance.post(APIENDPOINTS.SHOPPINGCART.ADD_TO_CART(userId), order )
        console.log("CartService -> addToCart -> response", response.data)
        return response.data
    }
}
export default CartService