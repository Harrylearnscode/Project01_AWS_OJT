import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const DishService = {
  getAllActiveDishes: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_ACTIVE_DISHES)
    console.log("DishService -> getAllActiveDishes -> response", response)
    console.log("DishService -> getAllActiveDishes -> response", response.data)
    return response.data
  },

  getDishDetail: async (dishId) => {
    const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_DISH_DETAIL(dishId))
    console.log("DishService -> getDishDetail -> response", response.data.data)
    return response.data.data
  },

  getRelatedDishes: async (dishId) => {
    const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_RELATED_DISHES(dishId))
    console.log("DishService -> getRelatedDishes -> response", response.data.data)
    return response.data.data
  },
}

export default DishService