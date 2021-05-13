import BasicLayout from '@/layouts/BasicLayout/index.vue'

const baseModuleNames = [
    '404',
]
const businessNames = [
    'Parking'
]
const bigScreenNames = [
    'Parking'
]


export default [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName:'login' */ '@/pages/Login/index.vue'),
        meta: {
            title: '登录',
            tokenAuth: false
        }
    },
    {
        path: '/',
        name: 'BasicLayout',
        component: BasicLayout,
        meta: {
            tokenAuth: true
        },
        children: [
            ...[].concat(
                ...baseModuleNames
                    .map(module => require(`@/Business/${module}/router.js`).default)
            )
        ]
    },
    // 大屏
    {
        path: '/bigScreen',
        name: 'BigScreenLayout',
        component: () => import(/* webpackChunkName:'BigScreenLayout' */ '@/layouts/BigScreenLayout/index.vue'),
        meta: {
            title: '可视化大屏',
            tokenAuth: true
        },
        children: [
            ...[].concat(
                ...['Parking']
                    .filter(x => bigScreenNames.includes(x))
                    .map(module => require(`@/BigScreen/${module}/router.js`).default)
            )
        ]
    },
    // 设置
    {
        path: '/setting',
        name: 'setting',
        component: BasicLayout,
        meta: {
            title: '设置',
            tokenAuth: true
        },
        children: [
            {
                path: 'template',
                name: 'template',
                component: () => import(/* webpackChunkName:'setting_template' */ '@/pages/Setting/template.vue'),
                meta: {
                    title: '模板配置',
                    tokenAuth: true
                }
            }
        ]
    },
    // 账号
    {
        path: '/account',
        name: 'account',
        component: BasicLayout,
        meta: {
            title: '账号',
            tokenAuth: true
        },
        children: [
            {
                path: 'domain',
                name: 'domain',
                component: () => import(/* webpackChunkName:'account_domain' */ '@/pages/Account/domain.vue'),
                meta: {
                    title: '域管理',
                    tokenAuth: true
                }
            },
            {
                path: 'role',
                name: 'role',
                component: () => import(/* webpackChunkName:'account_role' */ '@/pages/Account/role.vue'),
                meta: {
                    title: '角色管理',
                    tokenAuth: true
                }
            },
            {
                path: 'user',
                name: 'user',
                component: () => import(/* webpackChunkName:'account_user' */ '@/pages/Account/user.vue'),
                meta: {
                    title: '域管理',
                    tokenAuth: true
                }
            }
        ]
    },
    ...businessNames.map(module => require(`@/Business/${module}/router.js`).default),
    {
        path: '*',
        redirect: {path: '/404'}
    }
]
