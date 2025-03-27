import request from '@/utils/request'

// 查询APP软件管理列表
export function listHelperApp(query, pageReq) {
  return request({
    url: '/helper/helperApp/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询APP软件管理详细
export function getHelperApp(id) {
  return request({
    url: '/helper/helperApp/' + id,
    method: 'get'
  })
}

// 新增APP软件管理
export function addHelperApp(data) {
  return request({
    url: '/helper/helperApp',
    method: 'post',
    data: data
  })
}

// 修改APP软件管理
export function updateHelperApp(data) {
  return request({
    url: '/helper/helperApp',
    method: 'put',
    data: data
  })
}

// 删除APP软件管理
export function delHelperApp(id) {
  return request({
    url: '/helper/helperApp/' + id,
    method: 'delete'
  })
}

// 导出APP软件管理
export function exportHelperApp(query) {
  return request({
    url: '/helper/helperApp/export',
    method: 'get',
    params: query
  })
}


export function getUserByListHelperApp(id) {
  return request({
    url: '/helper/helperApp/getUserByListHelperApp/' + id,
    method: 'get'
  })
}

export function bacthAddHelperApp(data) {
  return request({
    url: '/helper/helperApp/bacthAddHelperApp',
    method: 'post',
    data: data
  })
}

export function bacthDelHelperApp(id,member) {
  return request({
    url: '/helper/helperApp/bacthDelHelperApp/' + id+"/"+member,
    method: 'delete'
  })
}