import request from '../axios'

export function fetchRoleList(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}
