"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
// import { createDish, updateDish, getDishById } from "@/lib/api"
import DishService from "../../api/service/Dish.service.jsx"

export default function MealFormModal({ mealId, isOpen, onClose, onMealUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    country: "",
    prepareTime: "",
    cookingTime: "",
    totalTime: "",
    imgUrl: "",
    types: [],
    dishIngredients: [],
    recipes: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && mealId) {
      fetchMealData()
    } else if (isOpen && !mealId) {
      resetForm()
    }
  }, [isOpen, mealId])

  const fetchMealData = async () => {
    setIsLoading(true)
    try {
      const data = await DishService.getDishDetail(mealId)
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        country: data.country || "",
        prepareTime: data.prepareTime || "",
        cookingTime: data.cookingTime || "",
        totalTime: data.totalTime || "",
        imgUrl: data.imgUrl || "",
        types: data.types || [],
        dishIngredients: data.dishIngredients || [],
        recipes: data.recipes || [],
      })
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch meal data")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      country: "",
      prepareTime: "",
      cookingTime: "",
      totalTime: "",
      imgUrl: "",
      types: [],
      dishIngredients: [],
      recipes: [],
    })
    setError(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Time") || name === "price" ? Number.parseFloat(value) || "" : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (mealId) {
        await DishService.updateDish(mealId, formData)
      } else {
        await DishService.createDish(formData)
      }
      onMealUpdated()
      onClose()
    } catch (err) {
      setError(err.message || "Failed to save meal")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-card-foreground">{mealId ? "Update Meal" : "Add New Meal"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading meal data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Meal Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                  <input
                    type="url"
                    name="imgUrl"
                    value={formData.imgUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Prepare Time (min)</label>
                  <input
                    type="number"
                    name="prepareTime"
                    value={formData.prepareTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Cooking Time (min)</label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Time (min)</label>
                  <input
                    type="number"
                    name="totalTime"
                    value={formData.totalTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : mealId ? "Update Meal" : "Create Meal"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
