"use client"

import { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import IngredientsTable from "../ui/ingredients-table"
import IngredientFormModal from "../ui/ingredient-form-modal"
// import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from "@/lib/api"
import IngredientService from "../../api/service/Ingredient.service"

export default function SellerIngredients() {
  const [ingredients, setIngredients] = useState([])
  const [filteredIngredients, setFilteredIngredients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadIngredients()
  }, [])

  useEffect(() => {
    const filtered = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredIngredients(filtered)
  }, [ingredients, searchTerm])

  const loadIngredients = async () => {
    try {
      setIsInitialLoading(true)
      setError(null)
      const data = await IngredientService.getAllIngredients()
      setIngredients(data)
    } catch (err) {
      setError("Failed to load ingredients. Please try again.")
      console.error(err)
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleOpenModal = (ingredient = null) => {
    setSelectedIngredient(ingredient)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIngredient(null)
  }

  const handleAddOrUpdate = async (formData) => {
    try {
      setIsLoading(true)
      setError(null)

      if (selectedIngredient) {
        await IngredientService.updateIngredient(selectedIngredient.ingredientId, formData)
      } else {
        await IngredientService.createIngredient(formData)
      }

      handleCloseModal()
      await loadIngredients()
    } catch (err) {
      setError(selectedIngredient ? "Failed to update ingredient" : "Failed to create ingredient")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (ingredientId) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) {
      return
    }

    try {
      setError(null)
      await IngredientService.deleteIngredient(ingredientId)
      await loadIngredients()
    } catch (err) {
      setError("Failed to delete ingredient")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ingredients Management</h1>
          <p className="text-muted-foreground">Manage your ingredient inventory</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={20} />
            Add Ingredient
          </button>
        </div>

        {isInitialLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading ingredients...</p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No ingredients found. Add your first ingredient!</p>
          </div>
        ) : (
          <IngredientsTable ingredients={filteredIngredients} onEdit={handleOpenModal} onDelete={handleDelete} />
        )}
      </div>

      <IngredientFormModal
        isOpen={isModalOpen}
        ingredient={selectedIngredient}
        onClose={handleCloseModal}
        onSubmit={handleAddOrUpdate}
        isLoading={isLoading}
      />
    </div>
  )
}
