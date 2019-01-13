import request from '../axios'

export function fetchUserList(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}
