import axiosInstance from "../axios.config.js"
import APIENDPOINTS from "../endpoint.js"

const DishIngredientService = {
  getAllDishIngredients: async () => {
    try {
      const response = await axiosInstance.get(APIENDPOINTS.DISH_INGREDIENT.GET_ALL)
      console.log("getAllDishIngredients response:", response);
      return response.data
    } catch (error) {
      console.error("Error in getAllDishIngredients:", error);
      throw error;
    }
  },
  
  getDishIngredientById: async (id) => {
    try {
      const response = await axiosInstance.get(APIENDPOINTS.DISH_INGREDIENT.GET_BY_ID.replace('{id}', id))
      console.log("getDishIngredientById response:", response);
      return response.data
    } catch (error) {
      console.error(`Error in getDishIngredientById for id ${id}:`, error);
      throw error;
    }
  },
  
  getDishIngredientsByDishId: async (dishId) => {
    try {
      console.log(`Getting ingredients for dish ID: ${dishId}`);
      const response = await axiosInstance.get(APIENDPOINTS.DISH_INGREDIENT.GET_BY_DISH.replace('{dishId}', dishId))
      console.log("getDishIngredientsByDishId response:", response);
      return response.data
    } catch (error) {
      console.error(`Error in getDishIngredientsByDishId for dishId ${dishId}:`, error);
      throw error;
    }
  },
  
  createDishIngredient: async (ingredientData) => {
    try {
      console.log("Creating ingredient:", ingredientData);
      const response = await axiosInstance.post(APIENDPOINTS.DISH_INGREDIENT.CREATE, ingredientData)
      console.log("createDishIngredient response:", response);
      return response.data
    } catch (error) {
      console.error("Error in createDishIngredient:", error);
      throw error;
    }
  },
  
  updateDishIngredient: async (id, ingredientData) => {
    try {
      console.log(`Updating ingredient ${id}:`, ingredientData);
      const response = await axiosInstance.put(APIENDPOINTS.DISH_INGREDIENT.UPDATE.replace('{id}', id), ingredientData)
      console.log("updateDishIngredient response:", response);
      return response.data
    } catch (error) {
      console.error(`Error in updateDishIngredient for id ${id}:`, error);
      throw error;
    }
  },
  
  deleteDishIngredient: async (id) => {
    try {
      console.log(`Deleting ingredient with id: ${id}`);
      const response = await axiosInstance.delete(APIENDPOINTS.DISH_INGREDIENT.DELETE.replace('{id}', id))
      console.log("deleteDishIngredient response:", response);
      return response.data
    } catch (error) {
      console.error(`Error in deleteDishIngredient for id ${id}:`, error);
      throw error;
    }
  }
}

export default DishIngredientService