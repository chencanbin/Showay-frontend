import request from '../axios'

export function getCompanyToken(key) {
  return request({
    url: `storage/company/upload/url?key=${key}`,
    method: 'get'
  })
}

export function getCompanyDownloadLink(key) {
  return request({
    url: `storage/company/download/url?key=${key}`,
    method: 'get'
  })
}
