import { fetchCommissionTableList } from '@/http/modules/commission'

const company = {
  namespaced: true,
  state: {
    commissionTableList: [],
    commissionTableDialogVisible: false
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
    }
  },
  actions: {
    FetchCommissionTableList({ commit }, { id, params }) {
      console.log(id)
      return fetchCommissionTableList(id, params).then(res => {
        commit('SET_COMMISSION_TABLE_LIST', res.data)
      })
    }
  }
}
export default company
