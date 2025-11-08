"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import DishService from "../../api/service/Dish.service.jsx"

export default function MealDetailModal({ mealId, isOpen, onClose, onMealUpdated }) {
  const [meal, setMeal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [expandedRecipes, setExpandedRecipes] = useState({})

  useEffect(() => {
    if (isOpen && mealId) {
      fetchMealDetails()
    }
  }, [isOpen, mealId])

  const fetchMealDetails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DishService.getDishDetail(mealId)
      setMeal(data)
      // Khởi tạo trạng thái expand cho recipe
      if (data.recipes) {
        const expanded = {}
        Object.keys(data.recipes).forEach((key) => {
          expanded[key] = true
        })
        setExpandedRecipes(expanded)
      }
    } catch (err) {
      setError(err.message || "Failed to fetch meal details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async () => {
    setIsUpdating(true)
    setError(null)
    try {
      await DishService.updateDishStatus(mealId)
      // ✅ Chỉ reload lại dữ liệu trong modal
      await fetchMealDetails()
      // ❌ Không gọi onMealUpdated ở đây nếu bạn không muốn reload cha
      // if (onMealUpdated) onMealUpdated()
    } catch (err) {
      setError(err.message || "Failed to update meal status")
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleRecipe = (recipeKey) => {
    setExpandedRecipes((prev) => ({
      ...prev,
      [recipeKey]: !prev[recipeKey],
    }))
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-card border-l border-border z-50 shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-card flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-card-foreground">Meal Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground text-sm">Loading meal details...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded text-sm">
              {error}
            </div>
          ) : meal ? (
            <div className="space-y-4">
              {meal.imgUrl && (
                <img
                  src={meal.imgUrl || "/placeholder.svg"}
                  alt={meal.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <div>
                <h3 className="text-lg font-bold mb-1">{meal.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{meal.description}</p>

                <div className="space-y-2 text-sm bg-muted p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold">Price:</span>
                    <span>${meal.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Country:</span>
                    <span>{meal.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Time:</span>
                    <span>{meal.totalTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Prep Time:</span>
                    <span>{meal.prepareTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Cook Time:</span>
                    <span>{meal.cookingTime} min</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        meal.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {meal.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Types */}
              {meal.types?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {meal.types.map((type, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {meal.dishIngredients?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Ingredients:</h4>
                  <div className="border border-border rounded-lg divide-y max-h-40 overflow-y-auto">
                    {meal.dishIngredients.map((item, idx) => (
                      <div key={idx} className="p-2 flex justify-between items-center text-sm">
                        <span className="text-card-foreground">{item.ingredient}</span>
                        <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {meal.recipes && Object.keys(meal.recipes).length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Recipe:</h4>
                  <div className="space-y-2">
                    {Object.entries(meal.recipes).map(([recipeKey, steps]) => (
                      <div key={recipeKey} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleRecipe(recipeKey)}
                          className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <span className="font-semibold text-sm">{recipeKey}</span>
                          {expandedRecipes[recipeKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {expandedRecipes[recipeKey] && (
                          <div className="p-3 bg-background/50 space-y-2 max-h-48 overflow-y-auto">
                            {Array.isArray(steps) &&
                              steps.map((step, idx) => (
                                <div key={idx} className="flex gap-2 text-sm">
                                  <span className="font-semibold text-primary min-w-5">{idx + 1}.</span>
                                  <span className="text-card-foreground">{step}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border mt-6">
                <button
                  onClick={handleStatusChange}
                  disabled={isUpdating}
                  className={`flex-1 py-2 rounded font-medium text-sm transition-colors ${
                    meal.status === "ACTIVE"
                      ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                      : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
                  } disabled:opacity-50`}
                >
                  {isUpdating ? "Updating..." : meal.status === "ACTIVE" ? "⊘ Deactivate" : "✓ Activate"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
