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

export function getPrivateToken(key) {
  return request({
    url: `storage/private/upload/url?key=${key}`,
    method: 'get'
  })
}

export function getPrivateDownloadLink(key) {
  return request({
    url: `storage/private/download/url?key=${key}`,
    method: 'get'
  })
}

export function fetchFolder(params) {
  return request({
    url: `/folder`,
    method: 'get',
    params
  })
}

export function fetchFolderById(id, params) {
  return request({
    url: `/folder/${id}`,
    method: 'get',
    params
  })
}

export function createFolder(data) {
  return request({
    url: `/folder`,
    method: 'post',
    data
  })
}

export function editFolder(id, data) {
  return request({
    url: `/folder/${id}`,
    method: 'put',
    data
  })
}

export function deleteFolder(id) {
  return request({
    url: `/folder/${id}`,
    method: 'delete'
  })
}

export function createFile(data) {
  return request({
    url: `/doc`,
    method: 'post',
    data
  })
}

export function editFile(id, data) {
  return request({
    url: `/doc/${id}`,
    method: 'put',
    data
  })
}

export function deleteFile(id) {
  return request({
    url: `/doc/${id}`,
    method: 'delete'
  })
}

export function getHomePageFileList(params) {
  return request({
    url: '/doc',
    method: 'get',
    params
  })
}
