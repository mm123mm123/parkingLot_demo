/**
 * router 404
 */

export default [
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName:'404' */ './Pages/index.vue'),
    meta: {
      title: '404'
    }
  }
]
