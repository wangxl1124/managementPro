import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import { API_TOKEN } from '@/api/apis'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {//登录
            path: '/',
            name: 'Login',
            component: Login
        },
        {//首页
            path: '/index',
            name: 'index',
            component: () => import('../pages/Index'),
            children: [{
                path: '/index/home',
                name: 'home',
                component: () => import('../pages/index/Home'),
                meta: { name: ['首页'], role: ['super', 'normal'] }
            },
            {
                path: '/index/order',
                name: 'order',
                component: () => import('../pages/index/Order'),
                meta: { name: ['订单管理'], role: ['super', 'normal'] }
            },
            {
                path: '/index/goodslist',
                name: 'goodslist',
                component: () => import('../pages/goods/GoodsList'),
                meta: { name: ['商品管理', '商品列表'], role: ['super', 'normal'] }
            },
            {
                path: '/index/addgoods',
                name: 'addgoods',
                component: () => import('../pages/goods/AddGoods'),
                meta: { name: ['商品管理', '商品添加'], role: ['super', 'normal'] }

            },
            {
                path: '/index/goodsclass',
                name: 'goodsclass',
                component: () => import('../pages/goods/GoodsClass'),
                meta: { name: ['商品管理', '商品分类'], role: ['super', 'normal'] }

            },
            //店铺管理
            {
                path: '/index/shops',
                name: 'shops',
                component: () => import('../pages/index/Shops'),
                meta: { name: ['店铺管理'], role: ['super'] }

            },
            //账号管理
            {//账号列表
                path: '/index/accountlist',
                name: 'accountlist',
                component: () => import('../pages/accout/AccountList'),
                meta: { name: ['账号管理', '账号列表'], role: ['super'] }
            },
            {//添加账号
                path: '/index/addaccount',
                name: 'addaccount',
                component: () => import('../pages/accout/AddAccount'),
                meta: { name: ['账号管理', '添加账号'], role: ['super'] }

            },
            {//修改密码
                path: '/index/changepwd',
                name: 'changepwd',
                component: () => import('../pages/accout/ChangePwd'),
                meta: { name: ['账号管理', '修改密码'], role: ['super', 'normal'] }

            },
            //销售统计
            {//商品统计
                path: '/index/comsta',
                name: 'comsta',
                component: () => import('../pages/sales/ComSta'),
                meta: { name: ['销售统计', '商品统计'], role: ['super'] }

            },
            {//订单统计
                path: '/index/ordersta',
                name: 'ordersta',
                component: () => import('../pages/sales/OrderSta'),
                meta: { name: ['销售统计', '订单统计'], role: ['super'] }

            },
            //个人中心
            {//订单统计
                path: '/index/mycenter',
                name: 'mycenter',
                component: () => import('../pages/index/Mycenter'),
                meta: { name: ['个人中心'], role: ['super', 'normal'] }

            },
            ]
        },

    ]
})

//路由守卫
router.beforeEach((to, from, next) => {

    if (to.path != '/') {

        API_TOKEN(localStorage.token).then((res) => {
            if (res.data.code == 0) {
                //还在登录状态
                
                if (to.meta.role.includes(localStorage.role)){
                    next()
                } else{
                    next(from.path)
                }
            } else {
                //登录已过期 拦截
                next('/')
            }
        })

    } else next()


    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数，表示放行
    //next()  放行  next('/') 强制跳转

    /*  if (to.path == '/') return next()
     //获取token
     const token = localStorage.token
     if (!token) return next('/')
     next() */
})

export default router