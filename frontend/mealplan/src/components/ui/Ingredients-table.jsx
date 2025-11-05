"use client"

import { Trash2, Edit2 } from "lucide-react"

export default function IngredientsTable({ ingredients, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-secondary border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Price</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Unit</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Stock</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Calories</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={ingredient.ingredientId} className={index % 2 === 0 ? "bg-background" : "bg-muted"}>
              <td className="px-4 py-3 text-foreground">{ingredient.name}</td>
              <td className="px-4 py-3 text-foreground">{ingredient.price.toLocaleString()} VND</td>
              <td className="px-4 py-3 text-foreground">{ingredient.unit}</td>
              <td className="px-4 py-3 text-foreground">{ingredient.stock}</td>
              <td className="px-4 py-3 text-foreground">{ingredient.calories}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(ingredient)}
                    className="p-2 hover:bg-secondary rounded-md transition-colors"
                    title="Edit ingredient"
                  >
                    <Edit2 size={18} className="text-primary" />
                  </button>
                  <button
                    onClick={() => onDelete(ingredient.ingredientId)}
                    className="p-2 hover:bg-secondary rounded-md transition-colors"
                    title="Delete ingredient"
                  >
                    <Trash2 size={18} className="text-destructive" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
