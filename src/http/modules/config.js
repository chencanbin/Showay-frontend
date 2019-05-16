import request from '../axios'

export function updateHomePageSetting(data) {
  return request({
    url: '/user/settings',
    method: 'post',
    data
  })
}
