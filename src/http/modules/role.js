import request from '../axios'

export function fetchRoleList(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}

export function editRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}
