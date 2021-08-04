import request from '../axios'

export function fetch(params) {
  return request({
    url: `/broker`,
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: `/broker`,
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: `/broker/${id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/broker/${id}`,
    method: 'delete'
  })
}