import { fetchClientList, fetchInsurancePolicyList, fetchRenewal } from '@/http/modules/client'
import { fetchChannelCommissionTable, fetchChannelCommissionPayment } from '@/http/modules/channel'
const client = {
  namespaced: true,
  state: {
    clientList: [],
    renewal: [],
    insurancePolicyList: [],
    channelCommissionTableList: [],
    channelCommissionPayment: [],
    channelCommissionLoading: false,
    insurancePolicyLoading: false,
    clientLoading: false,
    renewalLoading: false
  },
  mutations: {
    SHOW_RENEWAL_LOADING: (state) => {
      state.renewalLoading = true
    },
    HIDE_RENEWAL_LOADING: (state) => {
      state.renewalLoading = false
    },
    SHOW_CLIENT_LOADING: (state) => {
      state.clientLoading = true
    },
    HIDE_CLIENT_LOADING: (state) => {
      state.clientLoading = false
    },
    SHOW_INSURANCE_POLICY_LOADING: (state) => {
      state.insurancePolicyLoading = true
    },
    HIDE_INSURANCE_POLICY_LOADING: (state) => {
      state.insurancePolicyLoading = false
    },
    SHOW_CHANNEL_COMMISSION_TABLE_LOADING: (state) => {
      state.channelCommissionLoading = true
    },
    HIDE_CHANNEL_COMMISSION_TABLE_LOADING: (state) => {
      state.channelCommissionLoading = false
    },
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
      commit('SHOW_CLIENT_LOADING')
      return fetchClientList(params).then(res => {
        commit('SET_CLIENT_LIST', res.data)
        commit('HIDE_CLIENT_LOADING')
      }).catch(_ => {
        commit('HIDE_CLIENT_LOADING')
      })
    },
    FetchInsurancePolicyList({ commit }, { params }) {
      commit('SHOW_INSURANCE_POLICY_LOADING')
      return fetchInsurancePolicyList(params).then(res => {
        commit('SET_INSURANCE_POLICY_LIST', res.data)
        commit('HIDE_INSURANCE_POLICY_LOADING')
      }).catch(_ => {
        commit('HIDE_INSURANCE_POLICY_LOADING')
      })
    },
    FetchChannelCommissionTable({ commit }, params) {
      commit('SHOW_CHANNEL_COMMISSION_TABLE_LOADING')
      commit('SET_COMMISSION_TABLE_LIST', [])
      return fetchChannelCommissionTable(params).then(res => {
        commit('SET_COMMISSION_TABLE_LIST', res.data)
        commit('HIDE_CHANNEL_COMMISSION_TABLE_LOADING')
      }).catch(_ => {
        commit('HIDE_CHANNEL_COMMISSION_TABLE_LOADING')
      })
    },
    FetchChannelCommissionPayment({ commit }, params) {
      return fetchChannelCommissionPayment(params).then(res => {
        commit('SET_CHANNEL_COMMISSION_PAYMENT', res.data)
      })
    },
    FetchRenewal({ commit }, { id, params }) {
      commit('SHOW_RENEWAL_LOADING')
      return fetchRenewal(id, params).then(res => {
        const renewal = []
        renewal.push(res.data.primary)
        res.data.riders.forEach(item => {
          renewal.push(item)
        })
        commit('SET_RENEWAL', renewal)
        commit('HIDE_RENEWAL_LOADING')
      }).catch(_ => {
        commit('HIDE_RENEWAL_LOADING')
      })
    }
  }
}
export default client
