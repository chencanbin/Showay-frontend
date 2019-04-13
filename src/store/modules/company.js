import { fetchCompanyList } from '@/http/modules/company'

const company = {
  namespaced: true,
  state: {
    companyList: [],
    companyLoading: false
  },
  mutations: {
    SET_COMPANY_LIST: (state, compamyList) => {
      state.companyList = compamyList
    },
    SHOW_COMPANY_LOADING: (state) => {
      state.companyLoading = true
    },
    HIDE_COMPANY_LOADING: (state) => {
      state.companyLoading = false
    }
  },
  actions: {
    FetchCompanyList({ commit }, params) {
      commit('SHOW_COMPANY_LOADING')
      commit('SET_COMPANY_LIST', [])
      return fetchCompanyList(params).then(res => {
        commit('HIDE_COMPANY_LOADING')
        commit('SET_COMPANY_LIST', res.data)
      }).catch(_ => {
        commit('HIDE_COMPANY_LOADING')
      })
    }
  }
}
export default company
