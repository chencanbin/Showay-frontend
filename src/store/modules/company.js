import { fetchCompanyList } from '@/http/modules/company'

const company = {
  namespaced: true,
  state: {
    companyList: []
  },
  mutations: {
    SET_COMPANY_LIST: (state, compamyList) => {
      state.companyList = compamyList
    }
  },
  actions: {
    FetchCompanyList({ commit }, params) {
      return fetchCompanyList(params).then(res => {
        commit('SET_COMPANY_LIST', res.data)
      })
    }
  }
}
export default company
