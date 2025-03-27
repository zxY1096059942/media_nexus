import request from '@/utils/request'

// 查询上报日志列表
export function listHelperLog(query, pageReq) {
  return request({
    url: '/helper/helperLog/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询上报日志详细
export function getHelperLog(operId) {
  return request({
    url: '/helper/helperLog/' + operId,
    method: 'get'
  })
}

// 新增上报日志
export function addHelperLog(data) {
  return request({
    url: '/helper/helperLog',
    method: 'post',
    data: data
  })
}

// 修改上报日志
export function updateHelperLog(data) {
  return request({
    url: '/helper/helperLog',
    method: 'put',
    data: data
  })
}

// 删除上报日志
export function delHelperLog(operId) {
  return request({
    url: '/helper/helperLog/' + operId,
    method: 'delete'
  })
}

// 导出上报日志
export function exportHelperLog(query) {
  return request({
    url: '/helper/helperLog/export',
    method: 'get',
    params: query
  })
}
