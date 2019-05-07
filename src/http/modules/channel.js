import request from '../axios'

export function fetchChannelCommissionTable(params) {
  return request({
    url: '/channelCommissionTable',
    method: 'get',
    params
  })
}

export function fetchChannelCommissionPolicy(id, params) {
  return request({
    url: `/channelCommissionTable/${id}`,
    method: 'get',
    params
  })
}

export function editChannelCommissionPolicy(id, data) {
  return request({
    url: `/channelCommissionTable/${id}`,
    method: 'put',
    data
  })
}

export function deleteChannelCommissionPolicy(id) {
  return request({
    url: `/channelCommissionTable/${id}`,
    method: 'delete'
  })
}

export function createChannelCommissionPolicy(data) {
  return request({
    url: `/channelCommissionTable`,
    method: 'post',
    data
  })
}

export function previewChannelCommission(id, params) {
  return request({
    url: `/channelCommissionTable/${id}/view`,
    method: 'get',
    params
  })
}

export function fetchChannelCommissionPayment(params) {
  return request({
    url: `/channelCommissionPayment`,
    method: 'get',
    params
  })
}

export function editChannelCommissionPayment(id, data) {
  return request({
    url: `/channelCommissionPayment/${id}`,
    method: 'put',
    data
  })
}

export function fetchChannelExpenses(params) {
  return request({
    url: `/channelExpenses`,
    method: 'get',
    params
  })
}

export function addChannelExpenses(data) {
  return request({
    url: `/channelExpenses`,
    method: 'post',
    data
  })
}

export function editChannelExpenses(id, data) {
  return request({
    url: `/channelExpenses/${id}`,
    method: 'put',
    data
  })
}

export function deleteChannelExpenses(id) {
  return request({
    url: `/channelExpenses/${id}`,
    method: 'delete'
  })
}

