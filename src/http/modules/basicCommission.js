import request from '../axios'

export function fetchCommissionTableList(id, params) {
  let url = '/basicCommission'
  if (id) {
    url = `/basicCommission?company=${id}`
  }
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function fetchCommissionList(id, params) {
  return request({
    url: `/basicTable/draft/${id}`,
    method: 'get',
    params
  })
}

export function fetchCommissionTable(commissionTableId, params) {
  return request({
    url: `/basicCommission/${commissionTableId}`,
    method: 'get',
    params
  })
}

export function commissionTableDraft(id, data) {
  return request({
    url: `/basicTable/draft/${id}`,
    method: 'post',
    data
  })
}

export function publishCommissionTableDraft(id, effectiveDate, remarks) {
  return request({
    url: `/basicTable/draft/${id}/publish`,
    method: 'post',
    data: {
      effectiveDate,
      remarks
    }
  })
}


export function addCommission(data) {
  return request({
    url: `/basicCommission`,
    method: 'post',
    data
  })
}
