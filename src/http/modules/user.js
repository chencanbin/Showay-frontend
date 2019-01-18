import request from '../axios'

export function fetchUserList(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function editUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}
