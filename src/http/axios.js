import axios from 'axios'
import config from './config'
import router from '@/router'
import { Message, MessageBox, Notification } from 'element-ui'
// 使用vuex做全局loading时使用
import store from '@/store'
const _ = require('lodash')
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
          // 4003 :令牌超时;
          if (data.status === 4003 || data.status === 50012 || data.status === 50014) {
            // 请自行在引入 MessageBox
            MessageBox.confirm('你已被登出，请重新登录', '确定登出', {
              confirmButtonText: '确定',
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
            Message({
              message: data.message,
              type: 'error',
              showClose: true,
              duration: 50 * 1000
            })
            return reject(data)
          }
        } else {
          return data
        }
      },
      err => {
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break
            case 401:
              err.message = '未授权，请登录'
              break
            case 403:
              err.message = '拒绝访问'
              break
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break
            case 408:
              err.message = `请求超时: ${err.response.config.url}`
              break
            case 500:
              err.message = `服务器内部错误: ${err.response.config.url}`
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = `网关错误: ${err.response.config.url} `
              break
            case 503:
              err.message = '服务不可用'
              break
            case 504:
              err.message = '网关超时'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
          }
        }
        Notification.error({
          title: '错误',
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
