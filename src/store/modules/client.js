import { fetchClientList, fetchInsurancePolicyList, fetchRenewal } from '@/http/modules/client'
import { fetchChannelCommissionTable, fetchChannelCommissionPayment } from '@/http/modules/channel'
const client = {
  namespaced: true,
  state: {
    clientList: [],
    renewal: [],
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
    },
    SET_RENEWAL: (state, renewal) => {
      state.renewal = renewal
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
    },
    FetchRenewal({ commit }, { id, params }) {
      return fetchRenewal(id, params).then(res => {
        const renewal = []
        renewal.push(res.data.primary)
        res.data.riders.forEach(item => {
          renewal.push(item)
        })
        commit('SET_RENEWAL', renewal)
      })
    }
  }
}
export default client
