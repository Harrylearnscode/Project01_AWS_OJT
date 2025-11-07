"use client"

import { useState } from "react"
import { Search, Edit2 } from "lucide-react"

export default function MealsList({ meals, onMealClick, onEditClick, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMeals = meals.filter((meal) => meal.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading meals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search meals by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onMealClick(meal.id)}
          >
            {meal.imgUrl && (
              <div className="h-48 bg-muted overflow-hidden">
                <img
                  src={meal.imgUrl || "/placeholder.svg"}
                  alt={meal.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-card-foreground flex-1 line-clamp-2">{meal.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditClick(meal.id)
                  }}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Edit meal"
                >
                  <Edit2 size={18} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{meal.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${meal.price.toFixed(2)}</span>
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
              <div className="mt-3 pt-3 border-t border-border flex gap-2 text-xs text-muted-foreground">
                <span>⏱️ {meal.totalTime}m</span>
                <span>🌍 {meal.country}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No meals found matching your search.</p>
        </div>
      )}
    </div>
  )
}
