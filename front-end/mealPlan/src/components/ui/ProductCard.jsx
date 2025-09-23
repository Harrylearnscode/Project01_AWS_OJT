"use client"

import { Plus, Clock, Users } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/customer/mealdetail/${product.id}`);
  }


  const handleAddToCart = (e) => {
    e.stopPropagation() // Prevent navigation when clicking add to cart
    onAddToCart(product)
  }

  return (
    <div
      className="bg-card rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
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
            <span>{product.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{product.servings} servings</span>
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
              ${product.price}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">${product.originalPrice}</div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            style={{ fontFamily: "Source Sans Pro, sans-serif" }}
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
