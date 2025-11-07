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
  
  getAllDishes: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_ALL_DISHES)
    // console.log("DishService -> getAllDishes -> response", response)
    console.log("DishService -> getAllDishes -> response", response.data)
    return response.data
  },

  createDish: async (dishData) => {
    const response = await axiosInstance.post(APIENDPOINTS.DISH.CREATE_DISH, dishData)
    console.log("DishService -> createDish -> response", response)
    return response.data
  },

  updateDish: async (dishId, dishData) => {
    const response = await axiosInstance.put(APIENDPOINTS.DISH.UPDATE_DISH(dishId), dishData)
    console.log("DishService -> updateDish -> response", response)
    return response.data
  },

  updateDishStatus: async (dishId, status) => {
    const response = await axiosInstance.put(APIENDPOINTS.DISH.UPDATE_DISH_STATUS(dishId, status))
    console.log("DishService -> updateDishStatus -> response", response)
    return response.data.data
  },

  uploadDishImage: async (dishId, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    const response = await axiosInstance.post(APIENDPOINTS.DISH.UPLOAD_DISH_IMAGE(dishId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log("DishService -> uploadDishImage -> response", response)
    return response.data.data
  },
}

export default DishService