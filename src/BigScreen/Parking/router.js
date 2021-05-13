/**
 * router Parking
 */

export default [
  {
    path: 'parking',
    name: 'parking_layout',
    component: () => import(/* webpackChunkName:'v_p_layout' */ './layout/index.vue'),
    meta: {
      title: '停车管理',
      tokenAuth: true
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import(/* webpackChunkName:'v_p_home' */ './Pages/index.vue'),
        meta: {
          tokenAuth: true,
          title: '停车管理',
        }
      },
    ]
  },
]
