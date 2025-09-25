"use client"

import { useState, useEffect, useMemo } from "react"
import ProductCard from "../ui/ProductCard"
import Pagination from "../ui/Pagination"
import LoadingSkeleton from "../ui/LoadingSkeleton"
import DishService from "../../api/service/Dish.service.jsx"

const ShopPage = () => {
  const [allDishes, setAllDishes] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name") // name, price, totalTime
  const [sortOrder, setSortOrder] = useState("asc") // asc, desc
  const [filterByCountry, setFilterByCountry] = useState("")
  const [filterByType, setFilterByType] = useState("")

  const itemsPerPage = 12

  useEffect(() => {
    const loadAllDishes = async () => {
      setLoading(true)
      try {
        const response = await DishService.getAllActiveDishes()
        console.log("==> API data", response.data)

        const transformedDishes = response.data.map((dish) => ({
          id: dish.dishId,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          originalPrice: dish.price * 1.2,
          image: dish.imgUrl,
          category: dish.countryName,
          type: dish.typeNames[0] || "Main Course",
          prepareTime: dish.prepareTime,
          cookingTime: dish.cookingTime,
          totalTime: dish.totalTime,
          countryName: dish.countryName,
          typeNames: dish.typeNames,
        }))

        setAllDishes(transformedDishes)
      } catch (error) {
        console.error("Error loading dishes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllDishes()
  }, [])

  const filterOptions = useMemo(() => {
    const countries = [...new Set(allDishes.map((dish) => dish.countryName))]
    const types = [...new Set(allDishes.flatMap((dish) => dish.typeNames))]
    return { countries, types }
  }, [allDishes])

  const filteredAndSortedDishes = useMemo(() => {
  let filtered = [...allDishes] // copy để tránh mutate

  if (searchTerm) {
    filtered = filtered.filter(
      (dish) =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.countryName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (filterByCountry) {
    filtered = filtered.filter((dish) => dish.countryName === filterByCountry)
  }

  if (filterByType) {
    filtered = filtered.filter((dish) => dish.typeNames.includes(filterByType))
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return sortOrder === "desc"
          ? Number(b.price) - Number(a.price)
          : Number(a.price) - Number(b.price)
      case "totalTime":
        return sortOrder === "desc"
          ? Number(b.totalTime) - Number(a.totalTime)
          : Number(a.totalTime) - Number(b.totalTime)
      case "name":
      default:
        return sortOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
    }
  })

  return filtered
}, [allDishes, searchTerm, filterByCountry, filterByType, sortBy, sortOrder])


  const totalPages = Math.ceil(filteredAndSortedDishes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedDishes.slice(startIndex, endIndex)

  useEffect(() => {
    setProducts(currentProducts)
  }, [filteredAndSortedDishes, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterByCountry, filterByType, sortBy, sortOrder])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterByCountry("")
    setFilterByType("")
    setSortBy("name")
    setSortOrder("asc")
  }

  const handleAddToCart = (product) => {
    try {
      const existingCart = localStorage.getItem("mealplan-cart")
      const cartItems = existingCart ? JSON.parse(existingCart) : []

      const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1
      } else {
        cartItems.push({
          id: product.id,
          quantity: 1,
        })
      }

      localStorage.setItem("mealplan-cart", JSON.stringify(cartItems))

      console.log(`Added ${product.name} to cart`)

      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { product, cartItems },
        }),
      )
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-8">
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
      </div>

      <div className="bg-card rounded-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterByCountry}
            onChange={(e) => setFilterByCountry(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả quốc gia</option>
            {filterOptions.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={filterByType}
            onChange={(e) => setFilterByType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả loại món</option>
            {filterOptions.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="price">Sắp xếp theo giá</option>
            <option value="totalTime">Sắp xếp theo thời gian</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredAndSortedDishes.length)} trong tổng số{" "}
          {filteredAndSortedDishes.length} món ăn
          {(searchTerm || filterByCountry || filterByType) && (
            <span className="ml-2 text-primary">(đã lọc từ {allDishes.length} món ăn)</span>
          )}
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Không tìm thấy món ăn nào phù hợp với bộ lọc của bạn.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default ShopPage
