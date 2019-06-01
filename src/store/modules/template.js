import { fetchTemplateList } from '@/http/modules/template'

const template = {
  namespaced: true,
  state: {
    templateLoading: false,
    templates: []
  },
  mutations: {
    SHOW_TEMPLATE_LOADING: (state) => {
      state.templateLoading = true
    },
    HIDE_TEMPLATE_LOADING: (state) => {
      state.templateLoading = false
    },
    SET_TEMPLATES: (state, templates) => {
      state.templates = templates
    }
  },
  actions: {
    FetchTemplateList({ commit }, { params }) {
      commit('SHOW_TEMPLATE_LOADING')
      return fetchTemplateList(params).then(res => {
        commit('SET_TEMPLATES', res.data)
        commit('HIDE_TEMPLATE_LOADING')
      }).catch(_ => {
        commit('HIDE_TEMPLATE_LOADING')
      })
    }
  }
}
export default template
