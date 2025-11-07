const APIENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY: '/auth/verify',
    },
    CUSTOMER: {},
    SELLER: {},
    DISH: {
        CREATE_DISH: '/dishes/create',
        UPDATE_DISH: (id) => `/dishes/update/${id}`,
        UPDATE_DISH_STATUS: (id, status) => `/dishes/update-status/${id}?status=${status}`,
        GET_ALL_DISHES: '/dishes/getAllDishes',
        UPLOAD_DISH_IMAGE: (dishId)=> `/dishes/${dishId}/uploadImage`,
        GET_ACTIVE_DISHES: '/dishes/getAllActiveDishes',
        GET_DISH_DETAIL: (id)=> `/dishes/getById/${id}`,
        GET_RELATED_DISHES: (id)=> `/dishes/${id}/related`,
    },
    ORDER: {
        CREATE_ORDER: '/orders/checkout',
        GET_ALL_CUSTOMER_ORDERS: (customerId) => `/orders/by-user/${customerId}`,
        GET_ORDER_DETAIL: (orderId) => `/orders/getByOrderId/${orderId}`,
        GET_ORDER_STATUS: (orderId) => `/orders/getOrderStatusByOrderId/${orderId}`,
        CANCEL_ORDER: (orderId, userId) => `/orders/cancel/${orderId}?userId=${userId}`,
        GET_ALL_ORDER: `/orders/all`,
        UPDATE_ORDER_STATUS: (orderId, status) => `/orders/update-status/${orderId}?status=${status}`,
    },
    SHOPPINGCART: {
        ADD_TO_CART: (id) => `/carts/${id}/add`,
        GET_ALL_CART_ITEMS: (userID) => `/cart-dish/getByCart/${userID}`,
        REMOVE_CART_ITEM: (cartDishId) => `/cart-dish/remove/${cartDishId}`,
        GET_MEAL_PRICE: (cartDishId) => `/cart-dish/getCartDishPrice/${cartDishId}` ,
        UPDATE_CART_ITEM: (cartDishId, quantity) => `/cart-dish/update/${cartDishId}?quantity=${quantity}`,
        GET_INGREDIENTS: (cartDishId) => `cart-ingredient/getByCartDish/${cartDishId}`,
    },
    INGREDIENTS:{
        GET_ALL_INGREDIENTS: '/ingredients/getAll',
        UPDATE_INGREDIENT: (ingredientId) => `/ingredients/update/${ingredientId}`,
        CREATE_INGREDIENT: '/ingredients/create',
        DELETE_INGREDIENT: (ingredientId) => `/ingredients/delete/${ingredientId}`,
    }
};

export default APIENDPOINTS;