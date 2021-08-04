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

export function fetchCommissionList(id, params) {
  return request({
    url: `/commissionTableDraft/${id}`,
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


export function getChannelCommissionTable(id, params) {
  return request({
    url: `/channelCommissionTable/${id}`,
    method: 'get',
    params
  })
}

export function commissionTableDraft(id, data) {
  return request({
    url: `/commissionTableDraft/${id}`,
    method: 'post',
    data
  })
}


export function publishCommissionTableDraft(id, effectiveDate, remarks) {
  return request({
    url: `/commissionTableDraft/${id}/publish`,
    method: 'post',
    data: {
      effectiveDate,
      remarks
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


export function deleteCommission(id, password) {
  return request({
    headers: {
      'Authorization': password
    },
    url: `/commissionTable/${id}`,
    method: 'delete'
  })
}

export function fetchCommissionCredit(params) {
  return request({
    url: `/commissionCredit`,
    method: 'get',
    params
  })
}

export function fetchCleared(params) {
  return request({
    url: `/commissionCredit/cleared`,
    method: 'get',
    params
  })
}

export function CommissionCreditReject(data) {
  return request({
    url: `/commissionCredit/reject`,
    method: 'put',
    data
  })
}

export function CommissionCreditClear(data) {
  return request({
    url: `/commissionCredit/clear`,
    method: 'put',
    data
  })
}

export function editCommissionCredit(id, data) {
  return request({
    url: `/commissionCredit/${id}`,
    method: 'put',
    data
  })
}

export function getCommissionCreditSum(params) {
  return request({
    url: `/commissionCredit/sum`,
    method: 'get',
    params
  })
}

export function fetchAuditPayment(params) {
  return request({
    url: `/mergedPayment`,
    method: 'get',
    params
  })
}

export function fetchMergedPayment(id, params) {
  return request({
    url: `/mergedPayment/${id}`,
    method: 'get',
    params
  })
}

export function mergedPayment(data) {
  return request({
    url: `/mergedPayment`,
    method: 'post',
    data
  })
}

export function mergedPaymentReject(id) {
  return request({
    url: `/mergedPayment/${id}/reject`,
    method: 'put'
  })
}

export function mergedPaymentApprove(id) {
  return request({
    url: `/mergedPayment/${id}/approve`,
    method: 'put'
  })
}

export function mergedPaymentClear(id, data) {
  return request({
    url: `/mergedPayment/${id}/clear`,
    method: 'put',
    data
  })
}

export function fetchCommissionPolicy(params) {
  return request({
    url: `/commissionPolicy`,
    method: 'get',
    params
  })
}

export function editCommissionPolicy(data) {
  return request({
    url: `/commissionPolicy`,
    method: 'post',
    data
  })
}

export function fetchExpenses(params) {
  return request({
    url: `/expenses`,
    method: 'get',
    params
  })
}

export function addExpenses(data) {
  return request({
    url: `/expenses`,
    method: 'post',
    data
  })
}

export function editExpenses(id, data) {
  return request({
    url: `/expenses/${id}`,
    method: 'put',
    data
  })
}

export function deleteExpenses(id) {
  return request({
    url: `/expenses/${id}`,
    method: 'delete'
  })
}
