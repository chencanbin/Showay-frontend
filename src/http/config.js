import Cookies from 'js-cookie'

export default {
  method: 'get',
  // 基础url前缀
  baseUrl: process.env.BASE_API,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept-Language': Cookies.get('language') || 'en',
    'content-language': Cookies.get('language') || 'en'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
