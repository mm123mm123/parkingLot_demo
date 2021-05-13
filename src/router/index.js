import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import config from '@/config'

import routes from './routers'

const {homeName} = config

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    routes
})

const LOGIN_PAGE_NAME = 'login'
const NOT_FOUND_PAGE_NAME = '404'

router.beforeEach((to, from, next) => {
    // 判断是否需要token鉴权
    const tokenAuth = !!to?.meta?.tokenAuth || false
    if (!tokenAuth) {
        next()
        return
    }

    let token = store.getters.checkToken
    if (!token) {
        token = to?.query?.id
        token && store.commit('commitSetToken', token)
        token && store.commit('commitSetTokenTimeout')
        token && location.reload()
    }


    if (!token && to.name !== LOGIN_PAGE_NAME) { // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })
    } else if (!token && to.name === LOGIN_PAGE_NAME) { // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) { // 已登录且要跳转的页面是登录页
        next({
            name: homeName // 跳转到homeName页
        })
    } else {
        if (to.name === NOT_FOUND_PAGE_NAME) {
        }
        next()
    }
})

router.afterEach(to => {
    // setTitle(to, router.app)

    /* 路由发生变化修改页面title */
    const projectName = store.getters.getConfigData('projectName')
    document.title = to?.meta?.title || projectName

    window.scrollTo(0, 0)
})

export default router
