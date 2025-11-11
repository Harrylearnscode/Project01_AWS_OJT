"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import ProductCard from "../ui/ProductCard"
import LoadingSkeleton from "../ui/LoadingSkeleton"
import DishService from "../../api/service/Dish.service.jsx"

const ShopPage = () => {
  const [allDishes, setAllDishes] = useState([])
  const [visibleDishes, setVisibleDishes] = useState([]) // dishes currently displayed
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterByCountry, setFilterByCountry] = useState("")
  const [filterByType, setFilterByType] = useState("")
  const observerRef = useRef(null)

  const itemsPerLoad = 12 // how many to load at a time

  useEffect(() => {
    const loadAllDishes = async () => {
      setLoading(true)
      try {
        const response = await DishService.getAllActiveDishes()
        const transformedDishes = response.data.map((dish) => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image: dish.imgUrl,
          category: dish.country,
          type: dish.types[0] || "Main Course",
          prepareTime: dish.prepareTime,
          cookingTime: dish.cookingTime,
          totalTime: dish.totalTime,
          countryName: dish.country,
          typeNames: dish.types,
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

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const countries = [...new Set(allDishes.map((dish) => dish.countryName))]
    const types = [...new Set(allDishes.flatMap((dish) => dish.typeNames))]
    return { countries, types }
  }, [allDishes])

  // Apply search, filter, sort
  const filteredAndSortedDishes = useMemo(() => {
    let filtered = [...allDishes]

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

  // Reset visible dishes when filters change
  useEffect(() => {
    setVisibleDishes(filteredAndSortedDishes.slice(0, itemsPerLoad))
  }, [filteredAndSortedDishes])

  // Infinite scroll observer
  useEffect(() => {
    if (loading || filteredAndSortedDishes.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 1 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [filteredAndSortedDishes, visibleDishes, loadingMore])

  const loadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleDishes((prev) => {
        const nextItems = filteredAndSortedDishes.slice(prev.length, prev.length + itemsPerLoad)
        return [...prev, ...nextItems]
      })
      setLoadingMore(false)
    }, 500)
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
        cartItems.push({ id: product.id, quantity: 1 })
      }

      localStorage.setItem("mealplan-cart", JSON.stringify(cartItems))
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { product, cartItems } }))
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "Playfair Display, serif" }}>
          Fresh Meal Plans
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "Source Sans Pro, sans-serif" }}>
          Discover delicious, healthy meals delivered fresh to your door. Choose from our curated selection of chef-prepared dishes.
        </p>
      </div>

      <div className="bg-card rounded-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
          Hiển thị {visibleDishes.length} trong tổng số {filteredAndSortedDishes.length} món ăn
          {(searchTerm || filterByCountry || filterByType) && (
            <span className="ml-2 text-primary">(đã lọc từ {allDishes.length} món ăn)</span>
          )}
        </div>
      </div>

      {visibleDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleDishes.map((product) => (
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

      {/* Lazy load trigger */}
      {!loading && visibleDishes.length < filteredAndSortedDishes.length && (
        <div ref={observerRef} className="py-10 text-center text-muted-foreground">
          {loadingMore ? "Đang tải thêm..." : "Cuộn xuống để tải thêm món ăn..."}
        </div>
      )}
    </div>
  )
}

export default ShopPage
