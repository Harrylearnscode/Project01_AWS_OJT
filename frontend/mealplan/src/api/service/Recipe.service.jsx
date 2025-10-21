import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const RecipeService = {
  getAllRecipes: async () => {
    const response = await axiosInstance.get(APIENDPOINTS.RECIPE.GET_ALL)
    return response.data
  },
  
  getRecipeById: async (id) => {
    const response = await axiosInstance.get(APIENDPOINTS.RECIPE.GET_BY_ID.replace('{id}', id))
    return response.data
  },
  
  getRecipesByDishId: async (dishId) => {
    const response = await axiosInstance.get(APIENDPOINTS.RECIPE.GET_BY_DISH.replace('{dishId}', dishId))
    return response.data
  },
  
  createRecipe: async (recipeData) => {
    const response = await axiosInstance.post(APIENDPOINTS.RECIPE.CREATE, recipeData)
    return response.data
  },
  
  updateRecipe: async (id, recipeData) => {
    const response = await axiosInstance.put(APIENDPOINTS.RECIPE.UPDATE.replace('{id}', id), recipeData)
    return response.data
  },
  
  deleteRecipe: async (id) => {
    const response = await axiosInstance.delete(APIENDPOINTS.RECIPE.DELETE.replace('{id}', id))
    return response.data
  }
}

export default RecipeService