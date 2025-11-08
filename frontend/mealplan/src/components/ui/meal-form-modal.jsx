"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
// import { createDish, uploadDishImage, getDishById, updateDish, getIngredients, getAllTypes } from "@/lib/api"
import DishService from "../../api/service/Dish.service"
import TypeService from "../../api/service/Type.service"
import IngredientService from "../../api/service/Ingredient.service"
import CountryService from "../../api/service/Country.service"
export default function MealFormModal({ mealId, isOpen, onClose, onMealUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prepareTime: 0,
    cookingTime: 0,
    totalTime: 0,
    countryId: 1,
    typeIds: [],
    dishIngredients: [],
    recipes: [],
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [availableIngredients, setAvailableIngredients] = useState([])
  const [availableTypes, setAvailableTypes] = useState([])
  const [availableCountries, setAvailableCountries] = useState([])
  const [ingredientsLoading, setIngredientsLoading] = useState(false)
  const [typesLoading, setTypesLoading] = useState(false)
  const [countriesLoading, setCountriesLoading] = useState(false)

  useEffect(() => {
    if (isOpen && mealId) {
      fetchMealData()
    } else if (isOpen && !mealId) {
      resetForm()
    }
    if (isOpen) {
      fetchIngredientsTypesCountries()
    }
  }, [isOpen, mealId])

  const fetchIngredientsTypesCountries = async () => {
  setIngredientsLoading(true)
  setTypesLoading(true)
  setCountriesLoading(true)
  try {
    const [ingredientsData, typesData, countriesData] = await Promise.all([
      IngredientService.getAllIngredients(),
      TypeService.getAllTypes(),
      CountryService.getAllCountries(),
    ])
    setAvailableIngredients(ingredientsData || [])
    setAvailableTypes(typesData.data || [])
    setAvailableCountries(countriesData.data || countriesData || [])
  } catch (err) {
    console.error("Error fetching ingredients, types, or countries:", err)
  } finally {
    setIngredientsLoading(false)
    setTypesLoading(false)
    setCountriesLoading(false)
  }
}

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      prepareTime: 0,
      cookingTime: 0,
      totalTime: 0,
      countryId: 1,
      typeIds: [],
      dishIngredients: [],
      recipes: [],
    })
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Time") || name.includes("Id") ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTypeChange = (typeId) => {
    setFormData((prev) => ({
      ...prev,
      typeIds: prev.typeIds.includes(typeId) ? prev.typeIds.filter((id) => id !== typeId) : [...prev.typeIds, typeId],
    }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      dishIngredients: [...prev.dishIngredients, { ingredientId: 0, quantity: 0 }],
    }))
  }

  const updateIngredient = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.dishIngredients]
      updated[index] = {
        ...updated[index],
        [field]: field === "quantity" ? Number.parseFloat(value) || 0 : Number.parseInt(value) || 0,
      }
      return { ...prev, dishIngredients: updated }
    })
  }

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      dishIngredients: prev.dishIngredients.filter((_, i) => i !== index),
    }))
  }

  const addRecipe = () => {
    setFormData((prev) => ({
      ...prev,
      recipes: [...prev.recipes, { type: "preparation", step: prev.recipes.length + 1, content: "" }],
    }))
  }

  const updateRecipe = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.recipes]
      updated[index] = {
        ...updated[index],
        [field]: field === "step" ? Number.parseInt(value) || 1 : value,
      }
      return { ...prev, recipes: updated }
    })
  }

  const removeRecipe = (index) => {
    setFormData((prev) => ({
      ...prev,
      recipes: prev.recipes.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let dishId = mealId

      if (mealId) {
        // Update existing dish
        await DishService.updateDish(mealId, formData)
      } else {
        const response = await DishService.createDish(formData)
        dishId = response.dishId || response.id
      }

      if (imageFile && dishId) {
        await DishService.uploadDishImage(dishId, imageFile)
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
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-card z-50 shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-card flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-card-foreground">{mealId ? "Update Meal" : "Add New Meal"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading meal data...</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Meal Image</label>
                <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Meal Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Country</label>
                {countriesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading countries...</p>
                ) : (
                  <select
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value={0}>Select country</option>
                    {availableCountries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>


              <div className="border-t border-border pt-4">
                <label className="block text-sm font-medium text-foreground mb-3">Meal Type</label>
                {typesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading types...</p>
                ) : (
                  <div className="space-y-2">
                    {availableTypes.map((type) => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.typeIds.includes(type.id)}
                          onChange={() => handleTypeChange(type.id)}
                          className="w-4 h-4 rounded border-input"
                        />
                        <span className="text-sm text-foreground">{type.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Prepare (min)</label>
                  <input
                    type="number"
                    name="prepareTime"
                    value={formData.prepareTime}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Cook (min)</label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total (min)</label>
                  <input
                    type="number"
                    name="totalTime"
                    value={formData.totalTime}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Ingredients</h3>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {ingredientsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading ingredients...</p>
                ) : (
                  <div className="space-y-2">
                    {formData.dishIngredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">Ingredient</label>
                          <select
                            value={ingredient.ingredientId}
                            onChange={(e) => updateIngredient(index, "ingredientId", e.target.value)}
                            className="w-full px-2 py-1 border border-input rounded text-sm"
                          >
                            <option value={0}>Select ingredient</option>
                            {availableIngredients.map((ing) => (
                              <option key={ing.id} value={ing.ingredientId}>
                                {ing.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <label className="text-xs text-muted-foreground">Quantity</label>
                          <input
                            type="number"
                            step="0.01"
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                            className="w-full px-2 py-1 border border-input rounded text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Recipes</h3>
                  <button type="button" onClick={addRecipe} className="p-1 hover:bg-muted rounded transition-colors">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.recipes.map((recipe, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <select
                          value={recipe.type}
                          onChange={(e) => updateRecipe(index, "type", e.target.value)}
                          className="px-2 py-1 border border-input rounded text-sm"
                        >
                          <option value="preparation">Preparation</option>
                          <option value="cooking">Cooking</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeRecipe(index)}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        value={recipe.content}
                        onChange={(e) => updateRecipe(index, "content", e.target.value)}
                        placeholder="Recipe step content"
                        rows="2"
                        className="w-full px-2 py-1 border border-input rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : mealId ? "Update Meal" : "Create Meal"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  )
}
