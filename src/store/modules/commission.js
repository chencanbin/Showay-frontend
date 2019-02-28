import { fetchCommissionTableList, fetchCommissionCredit } from '@/http/modules/commission'

const company = {
  namespaced: true,
  state: {
    commissionTableList: [],
    commissionTableDialogVisible: false,
    commissionCredit: {}
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
    }
  }
}
export default company
