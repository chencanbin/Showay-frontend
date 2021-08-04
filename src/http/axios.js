import axios from 'axios'
import config from './config'
import router from '@/router'
import lang from './lang'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'
import { Message, MessageBox, Notification } from 'element-ui'
// 使用vuex做全局loading时使用
import store from '@/store'
const _ = require('lodash')
const language = Cookies.get('languange') || 'zh-CN'
let errorMessage
let errorNotification
const pending = []
const CancelToken = axios.CancelToken
const cancelPending = (config) => {
  pending.forEach((item, index) => {
    if (item.u.indexOf('folder') !== -1) {
      return
    }
    if (item.u.indexOf('trend') !== -1) {
      return
    }
    if (item.u.indexOf('renewal') !== -1) {
      return
    }
    if (item.u.indexOf('commissionCredit') !== -1) {
      return
    }
    if (item.u.indexOf('commissionTableDraft') !== -1) {
      return
    }
    if (item.u.indexOf('basicTable') !== -1) {
      return
    }
    if (config) {
      if (item.u === config.url) {
        item.f() // 取消请求
        pending.splice(index, 1) // 移除当前请求记录
      }
    } else {
      item.f() //  取消请求
      pending.splice(index, 1) //  移除当前请求记录
    }
  })
}
export default function $axios(options) {
  return new Promise((resolve, reject) => {
    // 初始化参数配置
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = getToken()
        if (config.data) {
          config.data = _.omitBy(config.data, _.isNull)
        }
        let url = config.url
        // get参数编码
        if (config.method === 'get' && config.params) {
          url += '?'
          const keys = Object.keys(config.params)
          for (const key of keys) {
            url += `${key}=${encodeURIComponent(config.params[key])}&`
          }
          url = url.substring(0, url.length - 1)
          config.params = {}
          config.url = url
        }
        cancelPending(config)
        config.cancelToken = new CancelToken((c) => {
          pending.push({ 'u': config.url, 'f': c })
        })
        return config
      },
      error => {
        // 请求错误时
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
          // return service.request(originalRequest);// 再重复请求一次
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        if (errorInfo) {
          error = errorInfo.data //  页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        let data
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        if (data.status !== 0) {
          //4003: 令牌超时;
          if (data.status === 4003 || data.status === 50012 || data.status === 50014) {
            // 请自行在引入 MessageBox
            MessageBox.confirm(lang.timeout[language], lang.logout[language], {
              confirmButtonText: lang.confirm[language],
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            })
          } else {
            if (errorMessage) {
              errorMessage.close()
            }
            errorMessage = Message({
              message: data.message,
              type: 'error',
              showClose: true,
              duration: 5 * 1000
            })
            return reject(data)
          }
        } else {
          return data
        }
      },
      err => {
        console.log(err)
        if (axios.isCancel(err)) {
          return reject(err.response)
        }
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = lang[400][language]
              break
            case 401:
              err.message = lang[401][language]
              break
            case 403:
              err.message = lang[403][language]
              break
            case 404:
              err.message = `${lang[404][language]}: ${err.response.config.url}`
              break
            case 408:
              err.message = `${lang[408][language]}: ${err.response.config.url}`
              break
            case 500:
              err.message = `${lang[500][language]}: ${err.response.config.url}`
              break
            case 501:
              err.message = lang[501][language]
              break
            case 502:
              err.message = `${lang[502][language]}: ${err.response.config.url} `
              break
            case 503:
              err.message = lang[503][language]
              break
            case 504:
              err.message = lang[504][language]
              break
            case 505:
              err.message = lang[505][language]
              break
            default:
          }
        }
        if (errorNotification) {
          errorNotification.close()
        }
        errorNotification = Notification.error({
          title: lang.error[language],
          message: err.message,
          duration: 0
        })
        return reject(err.response) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    })
  })
}
