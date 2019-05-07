import request from '../axios'

export function fetchCompanyList(params) {
  return request({
    url: '/company',
    method: 'get',
    params
  })
}

export function addCompany(data) {
  return request({
    url: '/company',
    method: 'post',
    data
  })
}

export function editCompany(id, data) {
  return request({
    url: `/company/${id}`,
    method: 'put',
    data
  })
}

export function getCompany(id) {
  return request({
    url: `/company/${id}`,
    method: 'get'
  })
}

export function delCompany(id) {
  return request({
    url: `/company/${id}`,
    method: 'delete'
  })
}

export function fetchCompanyContact(params) {
  return request({
    url: `/contact`,
    method: 'get',
    params
  })
}

export function createCompanyContact(data) {
  return request({
    url: `/contact`,
    method: 'post',
    data
  })
}

export function editCompanyContact(id, data) {
  return request({
    url: `/contact/${id}`,
    method: 'put',
    data
  })
}

export function deleteCompanyContact(id, data) {
  return request({
    url: `/contact/${id}`,
    method: 'delete'
  })
}
