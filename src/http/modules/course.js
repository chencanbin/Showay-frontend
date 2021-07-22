import request from '../axios'

/**
 * 查詢課程列表
 * @param {*} params 
 * @returns 
 */
export function fetch(params) {
  return request({
    url: '/training/course',
    method: 'get',
    params
  })
}

/**
 * 创建课程
 * @param {*} data 
 * @returns 
 */
export function create(data) {
  return request({
    url: '/training/course',
    method: 'post',
    data
  })
}

/**
 * 更新课程
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export function update(id, data) {
  return request({
    url: `/training/course/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除课程
 * @returns 
 */
export function remove(id) {
  return request({
    url: `/training/course/${id}`,
    method: 'delete'
  })
}

/**
 * 创建课程预约
 * @param {*} courseId 
 * @returns 
 */
export function createAppointment(courseId) {
  return request({
    url: `/training/course/${id}/appointment`,
    method: 'post'
  })
}

/**
 * 取消预约
 * @param {*} courseId 
 * @returns 
 */
export function removeAppointment(courseId) {
  return request({
    url: `/training/course/${id}/appointment`,
    method: 'delete'
  })
}


