"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, ChefHat, Plus, Minus } from "lucide-react"
import CartService from "../../api/service/Cart.service"
import DishService from "../../api/service/Dish.service"
import { useToast } from '../ui/use-toast.jsx';
import AuthModalContext from "../../context/AuthModalContext.jsx"
import { useContext } from "react";

const MealDetail = () => {
  const { openModal } = useContext(AuthModalContext);
  const { toast } = useToast();

  const { id } = useParams()
  const navigate = useNavigate()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("ingredients")
  const [relatedMeals, setRelatedMeals] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [ingredientQuantities, setIngredientQuantities] = useState({})
  const user = JSON.parse(localStorage.getItem("currentUser"))
  useEffect(() => {
    const loadMeal = async () => {
      try {
        setLoading(true)
        const mealData = await DishService.getDishDetail(id)
        setMeal(mealData)

        if (mealData.dishIngredients) {
          const initialQuantities = {}
          mealData.dishIngredients.forEach((ingredient, index) => {
            const ingredientId = ingredient.ingredientId || index
            initialQuantities[ingredientId] = {
              quantity: ingredient.quantity,
              defaultQuantity: ingredient.quantity,
              unit: ingredient.unit,
              name: ingredient.ingredient,
            }
          })
          setIngredientQuantities(initialQuantities)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const loadRelatedMeals = async () => {
      try {
        setRelatedLoading(true)
        const related = await DishService.getRelatedDishes(id)
        setRelatedMeals(related)
      } catch (err) {
        console.error("Failed to load related meals:", err)
      } finally {
        setRelatedLoading(false)
      }
    }

    loadMeal()
    loadRelatedMeals()

    window.scrollTo(0, 0)
  }, [id])

  const handleBackClick = () => {
    navigate("/customer/customerShop")
  }

const price = (ingredients, ingredientQuantities) => {
  if (!ingredients) return 0;

  return ingredients.reduce((total, ing, index) => {
    const ingredientId = ing.ingredientId || index;
    const currentData = ingredientQuantities[ingredientId];

    const ingQuantity = currentData?.quantity || ing.quantity || 0;
    const ingPrice = Number(ing.price || 0) * Number(ingQuantity)* quantity;

    return total + ingPrice;
  }, 0);
};


  const handleAddToCart = async (product) => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      openModal("login");   // 🔥 opens your layout modal
      return;
    }
    const ingredientsForOrder = Object.entries(ingredientQuantities).map(
      ([ingredientId, data]) => ({
        ingredientId: Number.parseInt(ingredientId),
        quantity: data.quantity,
      })
    );

    const orderData = {
      dishId: product.id,
      quantity: quantity,
      ingredients: ingredientsForOrder,
    };

    console.log("Order Data:", orderData);

    const response = await CartService.addToCart(user.id, orderData);
    console.log("Add to Cart Response:", response);

    // Show toast success
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000, // hiển thị 3 giây
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);

    // Show toast error
    toast({
      title: "Error",
      description: "Failed to add item to cart.",
      variant: "destructive", // nếu toast UI có variant destructive
      duration: 3000,
    });
  }
};


  const handleIngredientQuantityChange = (ingredientId, change) => {
    setIngredientQuantities((prev) => {
      const current = prev[ingredientId]
      const newQuantity = current.quantity + change

      if (newQuantity < current.defaultQuantity) {
        return prev
      }
      return {
        ...prev,
        [ingredientId]: {
          ...current,
          quantity: newQuantity,
        },
      }
    })
  }

  const calculateTotalKcal = (ingredients, ingredientQuantities) => {
    if (!ingredients) return 0;
    return ingredients.reduce((total, ing, index) => {
    const ingredientId = ing.ingredientId || index;
    const currentData = ingredientQuantities[ingredientId];

    const ingQuantity = currentData?.quantity || ing.quantity || 0;
    const ingCalories = Number(ing.calories || 0) * Number(ingQuantity);

    return total + ingCalories;
  }, 0);
  }



  const handleRelatedMealClick = (mealId) => {
    navigate(`/customer/mealdetail/${mealId}`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-6"></div>
          <div className="bg-card rounded-lg shadow-card border border-border p-8">
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          style={{ fontFamily: "Source Sans Pro, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>
        <div className="bg-card rounded-lg shadow-card border border-border p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!meal) return null

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleBackClick}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        style={{ fontFamily: "Source Sans Pro, sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </button>

      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img src={meal.imgUrl || "/placeholder.svg"} alt={meal.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-6">
            <div>
              <h1
                className="text-3xl font-bold text-card-foreground mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {meal.name}
              </h1>
              <p className="text-muted-foreground text-lg" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                {meal.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Prep: {meal.prepareTime} min</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ChefHat className="w-4 h-4" />
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Cook: {meal.cookingTime} min</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Total: {meal.totalTime} min</span>
              </div>
              <div className="text-muted-foreground">
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Country: {meal.country}</span>
              </div>
            </div>

            {meal.types && meal.types.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {meal.types.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                    style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4">
              <h3
                className="font-semibold text-card-foreground mb-2"
                style={{ fontFamily: "Source Sans Pro, sans-serif" }}
              >
                Estimated Nutrition
              </h3>
              <p className="text-2xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                {calculateTotalKcal(meal.dishIngredients, ingredientQuantities)} kcal
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                  {price(meal.dishIngredients, ingredientQuantities)} VND
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="text-sm font-medium text-card-foreground"
                  style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                >
                  Quantity:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(meal)}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                style={{ fontFamily: "Source Sans Pro, sans-serif" }}
              >
                Add to Cart - {price(meal.dishIngredients, ingredientQuantities).toFixed(2)} VND
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "ingredients"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-card-foreground"
              }`}
              style={{ fontFamily: "Source Sans Pro, sans-serif" }}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab("recipe")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "recipe"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-card-foreground"
              }`}
              style={{ fontFamily: "Source Sans Pro, sans-serif" }}
            >
              Recipe
            </button>
          </div>

          <div className="p-8">
            {activeTab === "ingredients" && (
              <div className="space-y-4">
                <h3
                  className="text-xl font-bold text-card-foreground mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Ingredients
                </h3>
                {/* <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                  Customize ingredient quantities for your order. Quantities cannot be reduced below the default amount.
                </p> */}
                <div className="grid gap-3">
                  {meal.dishIngredients?.map((ingredient, index) => {
                    const ingredientId = ingredient.ingredientId || index
                    const currentData = ingredientQuantities[ingredientId]

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 px-4 border border-border rounded-lg bg-muted/30"
                      >
                        <div className="flex-1">
                          <span
                            className="font-medium text-card-foreground block"
                            style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                          >
                            {ingredient.ingredient}
                          </span>
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                          >
                            Default: {currentData?.defaultQuantity} {currentData?.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleIngredientQuantityChange(ingredientId, -1)}
                            disabled={currentData?.quantity <= currentData?.defaultQuantity}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="text-center min-w-[60px]">
                            <span
                              className="font-semibold text-card-foreground block"
                              style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                            >
                              {currentData?.quantity}
                            </span>
                            <span
                              className="text-xs text-muted-foreground"
                              style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                            >
                              {currentData?.unit}
                            </span>
                          </div>
                          <button
                            onClick={() => handleIngredientQuantityChange(ingredientId, 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "recipe" && (
              <div className="space-y-6">
                <h3
                  className="text-xl font-bold text-card-foreground"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Recipe
                </h3>

                {meal.recipes?.Preparation && meal.recipes.Preparation.length > 0 && (
                  <div>
                    <h4
                      className="text-lg font-semibold text-card-foreground mb-3"
                      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                    >
                      Preparation
                    </h4>
                    <ol className="space-y-2">
                      {meal.recipes.Preparation.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {meal.recipes?.Cooking && meal.recipes.Cooking.length > 0 && (
                  <div>
                    <h4
                      className="text-lg font-semibold text-card-foreground mb-3"
                      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                    >
                      Cooking
                    </h4>
                    <ol className="space-y-2" start={meal.recipes.Preparation?.length + 1 || 1}>
                      {meal.recipes.Cooking.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {(meal.recipes.Preparation?.length || 0) + index + 1}
                          </span>
                          <span className="text-muted-foreground" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {meal.recipes?.Serving && meal.recipes.Serving.length > 0 && (
                  <div>
                    <h4
                      className="text-lg font-semibold text-card-foreground mb-3"
                      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                    >
                      Serving
                    </h4>
                    <ol
                      className="space-y-2"
                      start={(meal.recipes.Preparation?.length || 0) + (meal.recipes.Cooking?.length || 0) + 1}
                    >
                      {meal.recipes.Serving.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {(meal.recipes.Preparation?.length || 0) + (meal.recipes.Cooking?.length || 0) + index + 1}
                          </span>
                          <span className="text-muted-foreground" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-card-foreground mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
          You Might Also Like
        </h2>

        {relatedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedMeals.map((relatedMeal) => (
              <div
                key={relatedMeal.id}
                className="bg-card rounded-lg shadow-card border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleRelatedMealClick(relatedMeal.id)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedMeal.image || "/placeholder.svg"}
                    alt={relatedMeal.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="font-semibold text-card-foreground mb-2 line-clamp-2"
                    style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                  >
                    {relatedMeal.name}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground mb-3 line-clamp-2"
                    style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                  >
                    {relatedMeal.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                      {relatedMeal.price} VND
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>{relatedMeal.prepTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MealDetail
