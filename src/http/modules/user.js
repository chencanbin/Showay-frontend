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

export function addChannelHierarchy(data) {
  return request({
    url: `/channelHierarchy`,
    method: 'post',
    data
  })
}

export function editChannelHierarchy(id, data) {
  return request({
    url: `/channelHierarchy/${id}`,
    method: 'put',
    data
  })
}

export function deleteChannelHierarchy(id) {
  return request({
    url: `/channelHierarchy/${id}`,
    method: 'delete'
  })
}

export function fetchChannelHierarchy(params) {
  return request({
    url: `/channelHierarchy`,
    method: 'get',
    params
  })
}

export function resetPassword(data) {
  return request({
    url: `/user/resetPassword`,
    method: 'post',
    data
  })
}
