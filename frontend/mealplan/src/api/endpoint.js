const APIENDPOINTS = {
    AUTH: {},
    CUSTOMER: {},
    SELLER: {},
    DISH: {
        GET_ACTIVE_DISHES: '/dishes/getAll',
        GET_DISH_BY_ID: '/dishes/getById/{id}',
        CREATE_DISH: '/dishes/create',
        UPDATE_DISH: '/dishes/update/{id}',
        DELETE_DISH: '/dishes/delete/{id}'
    },
    RECIPE: {
        GET_ALL: '/recipes/all',
        GET_BY_ID: '/recipes/{id}',
        CREATE: '/recipes/create',
        UPDATE: '/recipes/{id}',
        DELETE: '/recipes/{id}',
        GET_BY_DISH: '/recipes/dish/{dishId}'
    },
    DISH_INGREDIENT: {
        GET_ALL: '/dish-ingredients/all',
        GET_BY_ID: '/dish-ingredients/{id}',
        CREATE: '/dish-ingredients/create',
        UPDATE: '/dish-ingredients/{id}',
        DELETE: '/dish-ingredients/{id}',
        GET_BY_DISH: '/dish-ingredients/dish/{dishId}'
    },
    ORDER: {
        GET_ALL_ORDERS: '/orders/all',
        GET_ORDERS_BY_USER: '/orders/by-user/{userId}',
        CREATE_ORDER: '/orders/create',
        UPDATE_ORDER_STATUS: '/orders/update-status/{orderId}',
        CANCEL_ORDER: '/orders/cancel/{orderId}'
    },
    SHOPPINGCART: {},
};

export default APIENDPOINTS;