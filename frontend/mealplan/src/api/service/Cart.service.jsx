import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const CartService = {
    addToCart: async (userId, order) => {
        const response = await axiosInstance.post(APIENDPOINTS.SHOPPINGCART.ADD_TO_CART(userId), order )
        console.log("CartService -> addToCart -> response", response.data)
        return response.data
    },
    getAllCartItems: async (userId) => {
        const response = await axiosInstance.get(APIENDPOINTS.SHOPPINGCART.GET_ALL_CART_ITEMS(userId))
        console.log("CartService -> getAllCartItems -> response", response.data)
        return response.data.data
    },
    removeCartItem: async (cartDishId) => {
        const response = await axiosInstance.delete(APIENDPOINTS.SHOPPINGCART.REMOVE_CART_ITEM(cartDishId))
        console.log("CartService -> removeCartItem -> response", response.data)
        return response.data.data
    },
    getMealPrice: async (cartDishId) => {
        const response = await axiosInstance.get(APIENDPOINTS.SHOPPINGCART.GET_MEAL_PRICE(cartDishId))
        console.log("CartService -> getMealPrice -> response", response.data)
        return response.data.data
    },
    updateCartItemQuantity: async (cartDishId, quantity) => {
        const response = await axiosInstance.put(APIENDPOINTS.SHOPPINGCART.UPDATE_CART_ITEM(cartDishId, quantity))
        console.log("CartService -> updateCartItem -> response", response.data.data)
        return response.data.data
    },
    getCartDishIngredients: async (cartDishId) => {
        const response = await axiosInstance.get(APIENDPOINTS.SHOPPINGCART.GET_INGREDIENTS(cartDishId))
        console.log("CartService -> getIngredients -> response", response.data)
        return response.data.data
    },

}
export default CartService