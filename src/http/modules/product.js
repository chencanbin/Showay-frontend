import request from '../axios'

export function fetchProductList(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}

export function traceInsurancePolicy(number) {
  return request({
    url: `/trace/insurancePolicy/${number}`,
    method: 'get'
  })
}
