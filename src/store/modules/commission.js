import { fetchCommissionTableList, fetchCommissionCredit, fetchAuditPayment, fetchMergedPayment } from '@/http/modules/commission'

const company = {
  namespaced: true,
  state: {
    commissionTableList: [],
    commissionTableDialogVisible: false,
    commissionCredit: {},
    mergedPayment: {},
    auditPayment: {}
  },
  mutations: {
    SET_COMMISSION_TABLE_LIST: (state, commissionTableList) => {
      state.commissionTableList = commissionTableList
    },
    SHOW_COMMISSION_TABLE_DIALOG_VISIBLE: (state) => {
      state.commissionTableDialogVisible = true
    },
    HIDE_COMMISSION_TABLE_DIALOG_VISIBLE: (state) => {
      state.commissionTableDialogVisible = false
    },
    SET_COMMISSION_CREDIT: (state, commissionCredit) => {
      state.commissionCredit = commissionCredit
    },
    SET_MERGED_PAYMENT: (state, mergedPayment) => {
      state.mergedPayment = mergedPayment
    },
    SET_AUDIT_PAYMENT: (state, auditPayment) => {
      state.auditPayment = auditPayment
    }
  },
  actions: {
    FetchCommissionTableList({ commit }, { id, params }) {
      return fetchCommissionTableList(id, params).then(res => {
        commit('SET_COMMISSION_TABLE_LIST', res.data)
      })
    },
    FetchCommissionCredit({ commit }, params) {
      return fetchCommissionCredit(params).then(res => {
        commit('SET_COMMISSION_CREDIT', res.data)
      })
    },
    FetchAuditPayment({ commit }, params) {
      return fetchAuditPayment(params).then(res => {
        commit('SET_AUDIT_PAYMENT', res.data)
      })
    },
    FetchMergedPayment({ commit }, { id, params }) {
      return fetchMergedPayment(id, params).then(res => {
        commit('SET_MERGED_PAYMENT', res.data)
      })
    }
  }
}
export default company
