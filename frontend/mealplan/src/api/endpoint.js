const APIENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY: '/auth/verify',
    },
    CUSTOMER: {},
    SELLER: {},
    DISH: {
        GET_ACTIVE_DISHES: '/dishes/getAll',
        GET_DISH_DETAIL: (id)=> `/dishes/getById/${id}`,
        GET_RELATED_DISHES: (id)=> `/dishes/${id}/related`,
    },
    ORDER: {
        CREATE_ORDER: '/orders/checkout',
        GET_ALL_CUSTOMER_ORDERS: (customerId) => `/orders/by-user/${customerId}`,
        GET_ORDER_DETAIL: (orderId) => `/orders/getByOrderId/${orderId}`,
        CANCEL_ORDER: (orderId) => `/api/orders/cancel/${orderId}`,
    },
    SHOPPINGCART: {
        ADD_TO_CART: (id) => `/carts/${id}/add`,
        GET_ALL_CART_ITEMS: (userID) => `/cart-dish/getByCart/${userID}`,
        REMOVE_CART_ITEM: (cartDishId) => `/cart-dish/remove/${cartDishId}`,
        GET_MEAL_PRICE: (cartDishId) => `/cart-dish/getCartDishPrice/${cartDishId}` ,
        UPDATE_CART_ITEM: (cartDishId, quantity) => `/cart-dish/update/${cartDishId}?quantity=${quantity}`,
        GET_INGREDIENTS: (cartDishId) => `cart-ingredient/getByCartDish/${cartDishId}`,
    },
};

export default APIENDPOINTS;