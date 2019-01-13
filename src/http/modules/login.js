import request from '../axios'

export function loginByUsername(loginForm) {
  return request({
    url: '/login',
    method: 'post',
    data: { ...loginForm }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function generateCode() {
  return request({
    url: '/verification',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

