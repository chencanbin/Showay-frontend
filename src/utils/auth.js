import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const IsLogin = 'IsLogin'

const UserIdKey = 'User-ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLoginStatus(status) {
  return sessionStorage.setItem(IsLogin, status)
}

export function getLoginStatus() {
  return sessionStorage.getItem(IsLogin)
}

export function removeLoginStatus() {
  return sessionStorage.removeItem(IsLogin)
}

export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId)
}

export function getUserId(userId) {
  return Cookies.get(UserIdKey)
}
