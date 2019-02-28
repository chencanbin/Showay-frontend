import { fetchClientList, fetchInsurancePolicyList } from '@/http/modules/client'
import { fetchChannelCommissionTable, fetchChannelCommissionPayment } from '@/http/modules/channel'
const client = {
  namespaced: true,
  state: {
    clientList: [],
    insurancePolicyList: [],
    channelCommissionTableList: [],
    channelCommissionPayment: []
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
    },
    SET_CHANNEL_COMMISSION_PAYMENT: (state, channelCommissionPayment) => {
      state.channelCommissionPayment = channelCommissionPayment
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
        commit('SET_COMMISSION_TABLE_LIST', res.data.list)
      })
    },
    FetchChannelCommissionPayment({ commit }, params) {
      return fetchChannelCommissionPayment(params).then(res => {
        commit('SET_CHANNEL_COMMISSION_PAYMENT', res.data)
      })
    }
  }
}
export default client
