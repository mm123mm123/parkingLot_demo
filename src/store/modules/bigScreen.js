import axios from 'axios'

const bigScreen = {
  state: {
    id: null,
    pageSize: {
      width: 1920,
      height: 1080
    },
    PageId: null,
    PageTitle: null,
    CompoList: []
  },
  getters: {
    // getDescription: state => state.description
    getModuleList: state => state.moduleList,
    getModuleData: state => key => {
      const { moduleList, id } = state
      const data = moduleList.find(x => x.id === id)
      if (!key) {
        return data
      } else {
        return data[key]
      }
    },
    getPageSize: state => state.pageSize,
    getPageId: state => state.PageId,
    getPageTitle: state => state.PageTitle || document.title,
    getCompoList: state => state.CompoList,

  },
  mutations: {
    commitSetModuleList (state, moduleList) {
      state.moduleList = moduleList
      moduleList.length && (state.id = moduleList[0].id)
    },
    setModule (state, id) {
      state.id = id
    },
    setPageId (state, id) {
      state.PageId = id
    },
    setPageSize (state, size) {
      let { width, height } = size
      width = +width.split('px')[0]
      height = +height.split('px')[0]
      state.pageSize = { width, height }
    },
    setPageTitle (state, PageTitle) {
      state.PageTitle = PageTitle || ''
      PageTitle && (document.title = PageTitle)
    },
    commitSetCompoList (state, CompoList) {
      state.CompoList = CompoList || []
    },
  },
  actions: {
    getPageData ({ commit }, id) {
      const env = process.env.NODE_ENV
      const pagePath = env === 'production' ? './page.json' : '/page.json'
      return axios.get(pagePath).then(res => {
        let PageList = []
        if (res.status === 200) {
          PageList = res.data
          const PageData = PageList[id]

          const { style: PageSize, name: PageTitle, children: CompoList, id: PageId } = PageData

          commit('setPageId', PageId)
          commit('setPageSize', PageSize)
          commit('setPageTitle', PageTitle)
          commit('commitSetCompoList', CompoList)
        }
      })
    },
  }
}

export default bigScreen
