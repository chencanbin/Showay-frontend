import { fetchCommissionTableList, fetchCommissionCredit, fetchAuditPayment, fetchMergedPayment, fetchCommissionPolicy } from '@/http/modules/commission'

const commission = {
  namespaced: true,
  state: {
    commissionTableList: [],
    commissionPolicy: [],
    commissionTableListLoading: false,
    commissionTableDialogVisible: false,
    commissionTableId: '',
    commissionCredit: {},
    mergedPayment: {},
    auditPayment: {},
    commissionCreditLoading: false,
    auditPaymentLoading: false,
    mergedPaymentLoading: false
  },
  mutations: {
    SHOW_MERGED_PAYMENT_LOADING: (state) => {
      state.mergedPaymentLoading = true
    },
    HIDE_MERGED_PAYMENT_LOADING: (state) => {
      state.mergedPaymentLoading = false
    },
    SHOW_AUDIT_PAYMENT_LOADING: (state) => {
      state.auditPaymentLoading = true
    },
    HIDE_AUDIT_PAYMENT_LOADING: (state) => {
      state.auditPaymentLoading = false
    },
    SHOW_COMMISSION_CREDIT_LOADING: (state) => {
      state.commissionCreditLoading = true
    },
    HIDE_COMMISSION_CREDIT_LOADING: (state) => {
      state.commissionCreditLoading = false
    },
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
      commit('SET_COMMISSION_TABLE_LIST', [])
      return fetchCommissionTableList(id, params).then(res => {
        commit('SET_COMMISSION_TABLE_LIST', res.data)
        commit('HIDE_COMMISSION_TABLE_LIST_LOADING')
      }).catch(_ => {
        commit('HIDE_COMMISSION_TABLE_LIST_LOADING')
      })
    },
    FetchCommissionCredit({ commit }, params) {
      commit('SHOW_COMMISSION_CREDIT_LOADING')
      return fetchCommissionCredit(params).then(res => {
        commit('SET_COMMISSION_CREDIT', res.data)
        commit('HIDE_COMMISSION_CREDIT_LOADING')
      }).catch(_ => {
        commit('HIDE_COMMISSION_CREDIT_LOADING')
      })
    },
    FetchAuditPayment({ commit }, params) {
      commit('SHOW_AUDIT_PAYMENT_LOADING')
      return fetchAuditPayment(params).then(res => {
        commit('SET_AUDIT_PAYMENT', res.data)
        commit('HIDE_AUDIT_PAYMENT_LOADING')
      }).catch(_ => {
        commit('HIDE_AUDIT_PAYMENT_LOADING')
      })
    },
    FetchMergedPayment({ commit }, { id, params }) {
      commit('SHOW_MERGED_PAYMENT_LOADING')
      return fetchMergedPayment(id, params).then(res => {
        commit('SET_MERGED_PAYMENT', res.data)
        commit('HIDE_MERGED_PAYMENT_LOADING')
      }).catch(_ => {
        commit('HIDE_MERGED_PAYMENT_LOADING')
      })
    },
    FetchCommissionPolicy({ commit }, params) {
      return fetchCommissionPolicy(params).then(res => {
        commit('SET_COMMISSION_POLICY', res.data)
      })
    }

  }
}
export default commission
