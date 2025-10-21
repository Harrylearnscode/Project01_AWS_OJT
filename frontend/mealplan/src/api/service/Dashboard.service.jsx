import React from 'react';
import axiosInstance from "../axios.config.js";
import APIENDPOINTS from "../endpoint.js";
import DishService from './Dish.service.jsx';
import OrderService from './Order.service.jsx';

const DashboardService = {
  // Get data for seller dashboard
  getDashboardData: async () => {
    try {
      // Fetch both orders and products in parallel
      const [ordersResponse, dishesResponse] = await Promise.all([
        OrderService.getAllOrders(),
        DishService.getAllActiveDishes()
      ]);

      // Process orders data
      const orders = ordersResponse && ordersResponse.data ? ordersResponse.data : [];
      
      // Process dishes data
      const dishes = dishesResponse && dishesResponse.data ? dishesResponse.data : [];
      
      // Calculate dashboard metrics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalProducts = dishes.length;
      
      // Get pending orders
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      
      // Get low inventory products (less than 10 items)
      const lowInventoryProducts = dishes.filter(dish => (dish.inventory || 0) < 10).length;
      
      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      
      // Get top selling products based on order history
      // This is a simplified version - in real backend this would be more sophisticated
      const productCounts = {};
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const id = item.dishId || item.id;
            if (id) {
              productCounts[id] = (productCounts[id] || 0) + (item.quantity || 1);
            }
          });
        }
      });
      
      // Convert to array and sort
      const topProducts = Object.keys(productCounts)
        .map(id => {
          const dish = dishes.find(d => d.id.toString() === id.toString());
          return {
            id,
            name: dish ? dish.name : `Product ${id}`,
            count: productCounts[id],
            price: dish ? dish.price : 0
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Return formatted dashboard data
      return {
        data: {
          summary: {
            totalOrders,
            totalRevenue,
            totalProducts,
            pendingOrders,
            lowInventoryProducts
          },
          recentOrders,
          topProducts,
          orders,
          dishes
        }
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
};

export default DashboardService;