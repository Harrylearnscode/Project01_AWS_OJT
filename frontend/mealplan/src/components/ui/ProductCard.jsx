"use client"

import { useState } from "react"
import { Plus, Clock, Users, Check, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleCardClick = () => {
    navigate(`/customer/mealdetail/${product.id}`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation() // Prevent navigation when clicking add to cart

    if (isAdding || justAdded) return

    setIsAdding(true)

    try {
      await onAddToCart(product)

      // Show success state
      setJustAdded(true)
      setTimeout(() => {
        setJustAdded(false)
      }, 2000) // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div
      className="bg-card rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.imgUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            className="font-bold text-lg text-card-foreground text-balance"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {product.name}
          </h3>
          <p
            className="text-sm text-muted-foreground mt-1 line-clamp-2"
            style={{ fontFamily: "Source Sans Pro, sans-serif" }}
          >
            {product.description}
          </p>
        </div>

        {/* Meal Details */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{product.totalTime || product.prepareTime + product.cookingTime} min</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{product.servings} servings</span>
          </div> */}
          {product.countryName && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{product.countryName}</span>
            </div>
          )}
        </div>

        {/* Dish Type Tags */}
        {product.typeNames && product.typeNames.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.typeNames.slice(0, 2).map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                style={{ fontFamily: "Source Sans Pro, sans-serif" }}
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
              {product.price} VND
            </div>
          </div>

          {/* <button
            onClick={handleAddToCart}
            disabled={isAdding || justAdded}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              justAdded
                ? "bg-green-500 text-white"
                : isAdding
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-105"
            }`}
            style={{ fontFamily: "Source Sans Pro, sans-serif" }}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
