import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const DishService = {
  getAllActiveDishes: async () => {
    try {
      const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_ACTIVE_DISHES)
      console.log("getAllActiveDishes response:", response);
      return response.data
    } catch (error) {
      console.error("Error in getAllActiveDishes:", error);
      throw error;
    }
  },
  
  getDishById: async (id) => {
    try {
      const response = await axiosInstance.get(APIENDPOINTS.DISH.GET_DISH_BY_ID.replace('{id}', id))
      console.log(`getDishById response for id ${id}:`, response);
      return response.data
    } catch (error) {
      console.error(`Error in getDishById for id ${id}:`, error);
      throw error;
    }
  },
  
  createDish: async (dishData) => {
    try {
      console.log("Creating dish:", dishData);
      const response = await axiosInstance.post(APIENDPOINTS.DISH.CREATE_DISH, dishData)
      console.log("createDish response:", response);
      return response.data
    } catch (error) {
      console.error("Error in createDish:", error);
      throw error;
    }
  },
  
  updateDish: async (id, dishData) => {
    try {
      console.log(`Updating dish ${id}:`, dishData);
      const response = await axiosInstance.put(APIENDPOINTS.DISH.UPDATE_DISH.replace('{id}', id), dishData)
      console.log(`updateDish response for id ${id}:`, response);
      return response.data
    } catch (error) {
      console.error(`Error in updateDish for id ${id}:`, error);
      throw error;
    }
  },
  
  deleteDish: async (id) => {
    try {
      console.log(`Deleting dish with id: ${id}`);
      const response = await axiosInstance.delete(APIENDPOINTS.DISH.DELETE_DISH.replace('{id}', id))
      console.log(`deleteDish response for id ${id}:`, response);
      return response.data
    } catch (error) {
      console.error(`Error in deleteDish for id ${id}:`, error);
      throw error;
    }
  }
}

export default DishService