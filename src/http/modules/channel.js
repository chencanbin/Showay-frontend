import request from '../axios'

export function fetchChannelCommissionTable(params) {
  return request({
    url: '/channelCommissionTable',
    method: 'get',
    params
  })
}
