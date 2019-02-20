import request from '../axios'

export function fetchCommissionTableList(id, params) {
  let url = '/commissionTable'
  if (id) {
    url = `/commissionTable?company=${id}`
  }
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function fetchCommissionList(companyId, params) {
  return request({
    url: `/commissionTableDraft/${companyId}`,
    method: 'get',
    params
  })
}

export function fetchCommissionTable(commissionTableId, params) {
  return request({
    url: `/commissionTable/${commissionTableId}`,
    method: 'get',
    params
  })
}

export function fetchChannelCommissionTable(params) {
  return request({
    url: `/channelCommissionTable`,
    method: 'get',
    params
  })
}

export function getChannelCommissionTable(id) {
  return request({
    url: `/channelCommissionTable/${id}`,
    method: 'get'
  })
}

export function commissionTableDraft(id, data) {
  return request({
    url: `/commissionTableDraft/${id}`,
    method: 'post',
    data
  })
}

export function publishCommissionTableDraft(id, effectiveDate) {
  return request({
    url: `/commissionTableDraft/${id}/publish`,
    method: 'post',
    data: {
      effectiveDate
    }
  })
}

export function addCommission(data) {
  return request({
    url: `/commissionTable`,
    method: 'post',
    data
  })
}

export function deleteCommission(id) {
  return request({
    url: `/commissionTable/${id}`,
    method: 'delete'
  })
}
