import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path : '/',
        name : 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path : '/category',
        name : 'category',
        component: () => import('../views/Category.vue')
    },
    {
        path : '/product',
        name : 'product',
        component: () => import('../views/Product.vue')
    },
]

const router = createRouter({
    history :createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;