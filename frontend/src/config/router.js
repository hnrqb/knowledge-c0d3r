import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ArticleByCategory from '@/components/article/ArticleByCategory'
import ArticleById from '@/components/article/ArticleById'
import Auth from '@/components/auth/Auth.vue'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages
}, {
    name: 'articleByCategory',
    path: '/categories/:id/articles',
    component: ArticleByCategory
}, {
    name: 'articleById',
    path: '/articles/:id',
    component: ArticleById
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}]

export default new VueRouter({
    mode: 'history',
    routes: routes
})