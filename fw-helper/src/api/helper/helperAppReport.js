import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listHelperAppReport(query, pageReq) {
  return request({
    url: '/helper/helperAppReport/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询【请填写功能名称】详细
export function getHelperAppReport(id) {
  return request({
    url: '/helper/helperAppReport/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addHelperAppReport(data) {
  return request({
    url: '/helper/helperAppReport',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateHelperAppReport(data) {
  return request({
    url: '/helper/helperAppReport',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delHelperAppReport(id) {
  return request({
    url: '/helper/helperAppReport/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportHelperAppReport(query) {
  return request({
    url: '/helper/helperAppReport/export',
    method: 'get',
    params: query
  })
}
