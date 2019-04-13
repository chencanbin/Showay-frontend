import { fetchCommissionTableList, fetchCommissionCredit, fetchAuditPayment, fetchMergedPayment, fetchCommissionPolicy } from '@/http/modules/commission'

const company = {
  namespaced: true,
  state: {
    commissionTableList: [],
    commissionPolicy: [],
    commissionTableListLoading: false,
    commissionTableDialogVisible: false,
    commissionTableId: '',
    commissionCredit: {},
    mergedPayment: {},
    auditPayment: {}
  },
  mutations: {
    SET_COMMISSION_TABLE_LIST: (state, commissionTableList) => {
      state.commissionTableList = commissionTableList
    },
    SHOW_COMMISSION_TABLE_DIALOG_VISIBLE: (state, id) => {
      state.commissionTableDialogVisible = true
      state.commissionTableId = id
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
    },
    SHOW_COMMISSION_TABLE_LIST_LOADING: (state) => {
      state.commissionTableListLoading = true
    },
    HIDE_COMMISSION_TABLE_LIST_LOADING: (state) => {
      state.commissionTableListLoading = false
    },
    SET_COMMISSION_POLICY: (state, commissionPolicy) => {
      state.commissionPolicy = commissionPolicy
    }
  },
  actions: {
    FetchCommissionTableList({ commit }, { id, params }) {
      commit('SHOW_COMMISSION_TABLE_LIST_LOADING')
      return fetchCommissionTableList(id, params).then(res => {
        commit('SET_COMMISSION_TABLE_LIST', res.data)
      }).catch(_ => {
        commit('HIDE_COMMISSION_TABLE_LIST_LOADING')
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
    },
    FetchCommissionPolicy({ commit }, params) {
      return fetchCommissionPolicy(params).then(res => {
        commit('SET_COMMISSION_POLICY', res.data)
      })
    }

  }
}
export default company
