import React from 'react'
import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"
const IngredientService = {
    getAllIngredients: async () => {
        const response = await axiosInstance.get(APIENDPOINTS.INGREDIENTS.GET_ALL_INGREDIENTS)
        console.log("IngredientService -> getAllIngredients -> response", response)
        console.log("IngredientService -> getAllIngredients -> response", response.data)
        return response.data.data
    },
    updateIngredient: async (ingredientId, ingredientData) => {
        const response = await axiosInstance.put(APIENDPOINTS.INGREDIENTS.UPDATE_INGREDIENT(ingredientId), ingredientData)
        console.log("IngredientService -> updateIngredient -> response", response.data)
        return response.data.data
    },
    createIngredient: async (ingredientData) => {
        const response = await axiosInstance.post(APIENDPOINTS.INGREDIENTS.CREATE_INGREDIENT, ingredientData)
        console.log("IngredientService -> createIngredient -> response", response.data)
        return response.data.data
    },
    deleteIngredient: async (ingredientId) => {
        const response = await axiosInstance.delete(APIENDPOINTS.INGREDIENTS.DELETE_INGREDIENT(ingredientId))
        console.log("IngredientService -> deleteIngredient -> response", response.data)
        return response.data.data
    },
}

export default IngredientService