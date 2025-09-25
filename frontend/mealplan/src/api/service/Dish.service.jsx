import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const DishService = {
  getAllActiveDishes: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_ACTIVE_DISHES)
    return response.data
  }
}

export default DishService