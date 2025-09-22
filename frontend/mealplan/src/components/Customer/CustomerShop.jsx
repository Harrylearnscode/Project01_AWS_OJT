"use client"

import { useState, useEffect } from "react"
import ProductCard from "../ui/ProductCard"
import Pagination from "../ui/Pagination"
import LoadingSkeleton from "../ui/LoadingSkeleton"
import { fetchFoodItems } from "../../data/mockMeal"

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchFoodItems(currentPage)
        setProducts(data.items)
        setTotalPages(data.totalPages)
        setTotalItems(data.totalItems)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product)
    // Here you would typically update cart state or call an API
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl font-bold text-foreground text-balance"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Fresh Meal Plans
        </h1>
        <p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          style={{ fontFamily: "Source Sans Pro, sans-serif" }}
        >
          Discover delicious, healthy meals delivered fresh to your door. Choose from our curated selection of
          chef-prepared dishes.
        </p>
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, totalItems)} of {totalItems} meals
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default ShopPage
