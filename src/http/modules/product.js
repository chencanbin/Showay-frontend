import request from '../axios'

export function fetchProductList(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}
