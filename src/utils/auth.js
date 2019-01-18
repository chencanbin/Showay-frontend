import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const IsLogin = 'IsLogin'

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
