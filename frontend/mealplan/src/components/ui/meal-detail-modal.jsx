"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
// import { getDishById, updateDishStatus } from "@/lib/api"
import DishService from "../../api/service/Dish.service.jsx"

export default function MealDetailModal({ mealId, isOpen, onClose, onMealUpdated }) {
  const [meal, setMeal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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
    } catch (err) {
      setError(err.message || "Failed to fetch meal details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true)
    try {
      await DishService.getDishDetail(mealId, newStatus)
      setMeal({ ...meal, status: newStatus })
      if (onMealUpdated) onMealUpdated()
    } catch (err) {
      setError(err.message || "Failed to update meal status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-card flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-card-foreground">Meal Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading meal details...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded">{error}</div>
          ) : meal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meal.imgUrl && (
                  <img
                    src={meal.imgUrl || "/placeholder.svg"}
                    alt={meal.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2">{meal.name}</h3>
                  <p className="text-muted-foreground mb-4">{meal.description}</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Price:</span> ${meal.price.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-semibold">Country:</span> {meal.country}
                    </p>
                    <p>
                      <span className="font-semibold">Total Time:</span> {meal.totalTime} minutes
                    </p>
                    <p>
                      <span className="font-semibold">Prepare Time:</span> {meal.prepareTime} minutes
                    </p>
                    <p>
                      <span className="font-semibold">Cooking Time:</span> {meal.cookingTime} minutes
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          meal.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {meal.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {meal.types && meal.types.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {meal.types.map((type, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {meal.dishIngredients && meal.dishIngredients.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <div className="border border-border rounded-lg divide-y">
                    {meal.dishIngredients.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center">
                        <span className="text-card-foreground">{item.ingredient}</span>
                        <span className="text-muted-foreground text-sm">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border mt-6">
                <button
                  onClick={() => handleStatusChange(meal.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                  disabled={isUpdatingStatus}
                  className={`flex-1 py-2 rounded font-medium transition-colors ${
                    meal.status === "ACTIVE"
                      ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                      : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
                  } disabled:opacity-50`}
                >
                  {meal.status === "ACTIVE" ? "⊘ Inactive" : "✓ Active"}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
