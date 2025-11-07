"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import MealsList from "../ui/meals-list"
import MealDetailModal from "../ui/meal-detail-modal"
import MealFormModal from "../ui/meal-form-modal"
import DishService from "../../api/service/Dish.service.jsx"

export default function SellerMeals() {
  const [meals, setMeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMealId, setSelectedMealId] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingMealId, setEditingMealId] = useState(null)

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DishService.getAllDishes()
      setMeals(data || [])
    } catch (err) {
      setError(err.message || "Failed to fetch meals")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMealClick = (mealId) => {
    setSelectedMealId(mealId)
    setIsDetailModalOpen(true)
  }

  const handleEditClick = (mealId) => {
    setEditingMealId(mealId)
    setIsFormModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingMealId(null)
    setIsFormModalOpen(true)
  }

  const handleMealUpdated = () => {
    fetchMeals()
    setIsDetailModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Meals Management</h1>
            <p className="text-muted-foreground">Manage your meal catalog</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Meal
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6">
            {error}
            <button onClick={fetchMeals} className="ml-4 underline font-medium hover:opacity-80">
              Retry
            </button>
          </div>
        )}

        <MealsList meals={meals} onMealClick={handleMealClick} onEditClick={handleEditClick} isLoading={isLoading} />

        <MealDetailModal
          mealId={selectedMealId}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onMealUpdated={handleMealUpdated}
        />

        <MealFormModal
          mealId={editingMealId}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onMealUpdated={handleMealUpdated}
        />
      </div>
    </div>
  )
}
