import { fetchCompanyList, fetchCompanyContact } from '@/http/modules/company'

const company = {
  namespaced: true,
  state: {
    companyList: [],
    contactList: [],
    companyLoading: false,
    contactLoading: false
  },
  mutations: {
    SHOW_CONTACT_LOADING: (state) => {
      state.contactLoading = true
    },
    HIDE_CONTACT_LOADING: (state) => {
      state.contactLoading = false
    },
    SET_CONTACT_LIST: (state, contactList) => {
      state.contactList = contactList
    },
    SET_COMPANY_LIST: (state, companyList) => {
      state.companyList = companyList
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
      return fetchCompanyList(params).then(res => {
        commit('HIDE_COMPANY_LOADING')
        commit('SET_COMPANY_LIST', res.data)
      }).catch(_ => {
        commit('HIDE_COMPANY_LOADING')
      })
    },
    FetchCompanyContact({ commit }, params) {
      commit('SHOW_CONTACT_LOADING')
      return fetchCompanyContact(params).then(res => {
        commit('HIDE_CONTACT_LOADING')
        commit('SET_CONTACT_LIST', res.data)
      }).catch(_ => {
        commit('HIDE_CONTACT_LOADING')
      })
    }
  }
}
export default company
