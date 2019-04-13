import request from '../axios'

export function fetchOverall(params) {
  return request({
    url: '/stats/overall',
    method: 'get',
    params
  })
}

export function fetchTrend(params) {
  return request({
    url: '/stats/trend',
    method: 'get',
    params
  })
}

export function fetchTop(params) {
  return request({
    url: '/stats/top',
    method: 'get',
    params
  })
}
