import request from '../axios'

export function fetchTemplateList(params) {
  return request({
    url: '/email/template',
    method: 'get',
    params
  })
}

export function getTemplateById(id) {
  return request({
    url: `/email/template/${id}`,
    method: 'get'
  })
}

export function editTemplateById(id, data) {
  return request({
    url: `/email/template/${id}`,
    method: 'put',
    data
  })
}

export function createEmailTemplate(data) {
  return request({
    url: '/email/template',
    method: 'post',
    data
  })
}

export function deleteEmailTemplate(id) {
  return request({
    url: `/email/template/${id}`,
    method: 'delete'
  })
}
