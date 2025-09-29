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
    ORDER: {},
    SHOPPINGCART: {},
};

export default APIENDPOINTS;