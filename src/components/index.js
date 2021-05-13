import Vue from 'vue'

// 组件

import GLoading from './GLoading/index.vue'
import GTag from './GTag'
import GForm from './GForm/index.vue'
import GTable from './GTable'
import GCheckbox from './GCheckbox'

import None from './None/index.vue'
import Icons from './Icons'
import Number from './Number/index.vue'

import DomainTree from './DomainTree'
import BodyCard from './BodyCard'

import MapGetpoint from './MapGetpoint'
import MapPolygon from './MapPolygon'
import MapInfo from './MapInfo'

import PageListTemplate from './PageListTemplate'


export default (Vue) => {
  Vue.component('GLoading', GLoading)
  Vue.component('GTag', GTag)
  Vue.component('GForm', GForm)
  Vue.component('GTable', GTable)
  Vue.component('GCheckbox', GCheckbox)
  
  Vue.component('None', None)
  Vue.component('Icons', Icons)
  Vue.component('Number', Number)
  
  Vue.component('DomainTree', DomainTree)
  Vue.component('BodyCard', BodyCard)

  Vue.component('MapGetpoint', MapGetpoint)
  Vue.component('MapPolygon', MapPolygon)
  Vue.component('MapInfo', MapInfo)
 
  Vue.component('PageListTemplate', PageListTemplate)
}

