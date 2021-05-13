import request from '@/plugins/axios'
import { api } from '@/config/api'
import { storageSet, storageGet } from '@/utils/utils'
import { Message } from 'element-ui'


const template = {
  state: {
    templateState: false,
    template: {},
    title: '',
    logoLargeUrl: '',
    logoSmallUrl: '',
    type: '',
    top_bar: [],
    side_bar: [],
    side_menu: [],
    hasSideMenu: false
  },
  getters: {
    getTemplateData: state => key => {
      const template = state.template
      if (key) {
        return template[key]
      }
      return template
    },
    getTemplateType: state => state.type || 'CE',
    getTemplateTitle: state => state.title,
    getTemplateHasSide: state => state.hasSideMenu,
    getTemplateTopBar: state => (state.top_bar || []),
    getTemplateSideBar: state => (state.side_bar || []),
    getTemplateSideMenu: state => (state.side_menu || []),
  },
  mutations: {
    // 销毁模板信息
    destroyTemplate (state) {
      state.templateState = false
      state.template = {}
      state.title = ''
      state.logoLargeUrl = ''
      state.logoSmallUrl = ''
      state.type = ''
      state.top_bar = []
      state.side_bar = []
      state.side_menu = []
      state.hasSideMenu = false
    },
    commitSetTemplate (state, template) {
      state.templateState = true
      state.template = template
      state.title = template.title
      state.logoLargeUrl = template.logoLargeUrl
      state.logoSmallUrl = template.logoSmallUrl
      state.type = template.type

      state.top_bar = (template.top_bar && template.top_bar.menu) || []
      state.side_bar = (template.side_bar && template.side_bar.menu) || []

      let side_bar = (template.side_bar && template.side_bar.menu) || []
      let side_bar_count = 0
      side_bar.forEach(x => {
        if (x.length) {
          x.forEach(y => {
            side_bar_count += y.menu.length
          })
        }
      })
      state.hasSideMenu = !!side_bar_count

      state.side_menu = template.side_menu || []

    }
  },
  actions: {
    // 获取用户ui模板
    getUiTemplate ({ state, commit }) {
      const { templateState, template } = state
      if (templateState) {
        return Promise.resolve(template)
      }
      return request.post(api.self.get_ui_template).then(res => {
        let template = {}
        if (res.code === 1000 && res.template) {
          template = res.template
          commit('commitSetTemplate', template)
        } else {
          Message.error(`获取模板失败`)
        }
        return template
      })
    }
  }
}

export default template
