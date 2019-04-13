import request from '../axios'

export function fetchClientList(params) {
  return request({
    url: `/client`,
    method: 'get',
    params
  })
}

export function createClient(data) {
  return request({
    url: '/client',
    method: 'post',
    data
  })
}

export function getClientById(id) {
  return request({
    url: `/client/${id}`,
    method: 'get'
  })
}
export function updateClient(id, data) {
  return request({
    url: `/client/${id}`,
    method: 'put',
    data
  })
}
export function deleteClient(id) {
  return request({
    url: `/client/${id}`,
    method: 'delete'
  })
}

export function fetchInsurancePolicyList(params) {
  return request({
    url: `/insurancePolicy`,
    method: 'get',
    params
  })
}

export function createInsurancePolicy(data) {
  return request({
    url: `/insurancePolicy`,
    method: 'post',
    data
  })
}

export function editInsurancePolicy(id, data) {
  return request({
    url: `/insurancePolicy/${id}`,
    method: 'put',
    data
  })
}

export function deleteInsurancePolicy(id) {
  return request({
    url: `/insurancePolicy/${id}`,
    method: 'delete'
  })
}

export function resetInsurancePolicy(id) {
  return request({
    url: `/insurancePolicy/${id}/reset`,
    method: 'post'
  })
}

export function fetchRenewal(id, params) {
  return request({
    url: `/insurancePolicy/renewal/${id}`,
    method: 'get',
    params
  })
}

export function createRenewal(id, data) {
  return request({
    url: `/insurancePolicy/${id}/renew`,
    method: 'post',
    data
  })
}

export function editRenewal(id, data) {
  return request({
    url: `/insurancePolicy/renewal/${id}`,
    method: 'put',
    data
  })
}

export function deleteRenewal(id) {
  return request({
    url: `/insurancePolicy/renewal/${id}`,
    method: 'delete'
  })
}

export function calendarRenewal(params) {
  return request({
    url: `/calendar/renewal`,
    method: 'get',
    params
  })
}
