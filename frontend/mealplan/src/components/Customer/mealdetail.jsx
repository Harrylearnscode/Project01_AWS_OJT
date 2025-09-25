"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, ChefHat, Users, Plus, Minus } from "lucide-react"
import { fetchMealDetail, fetchRelatedMeals } from "../../data/mockMeal"

const MealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("ingredients")
  const [relatedMeals, setRelatedMeals] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(true)

useEffect(() => {
  const loadMeal = async () => {
    try {
      setLoading(true)
      const mealData = await fetchMealDetail(id)
      setMeal(mealData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedMeals = async () => {
    try {
      setRelatedLoading(true)
      const related = await fetchRelatedMeals(id)
      setRelatedMeals(related)
    } catch (err) {
      console.error("Failed to load related meals:", err)
    } finally {
      setRelatedLoading(false)
    }
  }

  loadMeal()
  loadRelatedMeals()

  // Scroll lên đầu mỗi khi id thay đổi
  window.scrollTo(0, 0)
}, [id])


  const handleBackClick = () => {
    navigate("/customer/customerShop")
  }

  const handleAddToCart = (product) => {
    // console.log(`Added ${quantity} x ${meal.name} to cart`)
    // Here you would typically dispatch to a cart context or state management
    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("mealplan-cart")
      const cartItems = existingCart ? JSON.parse(existingCart) : []

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // If item exists, increment quantity
        cartItems[existingItemIndex].quantity += quantity
      } else {
        // If item doesn't exist, add new item with quantity 1
        cartItems.push({
          id: product.id,
          quantity: quantity,
        })
      }

      // Save updated cart to localStorage
      localStorage.setItem("mealplan-cart", JSON.stringify(cartItems))

      // Show success feedback (you could add a toast notification here)
      console.log(`Added ${product.name} to cart`)

      // Optional: Dispatch a custom event to notify other components about cart update
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { product, cartItems },
        }),
      )
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }

  }

  const calculateTotalKcal = () => {
    if (!meal?.ingredients) return 0
    return meal.ingredients.reduce((total, ingredient) => total + ingredient.kcalPerUnit, 0)
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
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        style={{ fontFamily: "Source Sans Pro, sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </button>

      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden">
            <img src={meal.image || "/placeholder.svg"} alt={meal.name} className="w-full h-full object-cover" />
          </div>

          {/* Basic Info */}
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

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Prep: {meal.prepTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ChefHat className="w-4 h-4" />
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Cook: {meal.cookingTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Serves: {meal.servings}</span>
              </div>
              <div className="text-muted-foreground">
                <span style={{ fontFamily: "Source Sans Pro, sans-serif" }}>Type: {meal.type}</span>
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3
                className="font-semibold text-card-foreground mb-2"
                style={{ fontFamily: "Source Sans Pro, sans-serif" }}
              >
                Nutrition per serving
              </h3>
              <p className="text-2xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                {Math.round(calculateTotalKcal() / meal.servings)} kcal
              </p>
            </div>

            {/* Price and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                  ${meal.price}
                </span>
                {meal.originalPrice && (
                  <span
                    className="text-lg text-muted-foreground line-through"
                    style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                  >
                    ${meal.originalPrice}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
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

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(meal)}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                style={{ fontFamily: "Source Sans Pro, sans-serif" }}
              >
                Add to Cart - ${(meal.price * quantity).toFixed(2)}
              </button>

            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-border">
          {/* Tab Navigation */}
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

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "ingredients" && (
              <div className="space-y-4">
                <h3
                  className="text-xl font-bold text-card-foreground mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Ingredients
                </h3>
                <div className="grid gap-3">
                  {meal.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                      <div>
                        <span
                          className="font-medium text-card-foreground"
                          style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                        >
                          {ingredient.name}
                        </span>
                        <span
                          className="text-muted-foreground ml-2"
                          style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                        >
                          {ingredient.quantity}
                        </span>
                      </div>
                      <span
                        className="text-sm text-muted-foreground"
                        style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                      >
                        {ingredient.kcalPerUnit} kcal
                      </span>
                    </div>
                  ))}
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

                {meal.recipe?.preparation && meal.recipe.preparation.length > 0 && (
                  <div>
                    <h4
                      className="text-lg font-semibold text-card-foreground mb-3"
                      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                    >
                      Preparation
                    </h4>
                    <ol className="space-y-2">
                      {meal.recipe.preparation.map((step, index) => (
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

                {meal.recipe?.cooking && meal.recipe.cooking.length > 0 && (
                  <div>
                    <h4
                      className="text-lg font-semibold text-card-foreground mb-3"
                      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                    >
                      Cooking
                    </h4>
                    <ol className="space-y-2" start={meal.recipe.preparation?.length + 1 || 1}>
                      {meal.recipe.cooking.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {(meal.recipe.preparation?.length || 0) + index + 1}
                          </span>
                          <span className="text-muted-foreground" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {meal.recipe?.tips && meal.recipe.tips.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4
                      className="text-lg font-semibold text-card-foreground mb-3"
                      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
                    >
                      Chef's Tips
                    </h4>
                    <ul className="space-y-2">
                      {meal.recipe.tips.map((tip, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-muted-foreground" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Meals Section */}
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
                      ${relatedMeal.price}
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
