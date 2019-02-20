import { fetchClientList, fetchInsurancePolicyList } from '@/http/modules/client'
import { fetchChannelCommissionTable } from '@/http/modules/channel'
const client = {
  namespaced: true,
  state: {
    clientList: [],
    insurancePolicyList: [],
    channelCommissionTableList: []
  },
  mutations: {
    SET_CLIENT_LIST: (state, clientList) => {
      state.clientList = clientList
    },
    SET_INSURANCE_POLICY_LIST: (state, insurancePolicyList) => {
      state.insurancePolicyList = insurancePolicyList
    },
    SET_COMMISSION_TABLE_LIST: (state, channelCommissionTableList) => {
      state.channelCommissionTableList = channelCommissionTableList
    }
  },
  actions: {
    FetchClientList({ commit }, { params }) {
      return fetchClientList(params).then(res => {
        commit('SET_CLIENT_LIST', res.data)
      })
    },
    FetchInsurancePolicyList({ commit }, { params }) {
      return fetchInsurancePolicyList(params).then(res => {
        commit('SET_INSURANCE_POLICY_LIST', res.data)
      })
    },
    FetchChannelCommissionTable({ commit }, params) {
      return fetchChannelCommissionTable(params).then(res => {
        commit('SET_COMMISSION_TABLE_LIST', res.data)
      })
    }
  }
}
export default client
