import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listHelperBmMemberDay(query, pageReq) {
  return request({
    url: '/helper/helperBmMemberDay/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询【请填写功能名称】详细
export function getHelperBmMemberDay(id) {
  return request({
    url: '/helper/helperBmMemberDay/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addHelperBmMemberDay(data) {
  return request({
    url: '/helper/helperBmMemberDay',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateHelperBmMemberDay(data) {
  return request({
    url: '/helper/helperBmMemberDay',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delHelperBmMemberDay(id) {
  return request({
    url: '/helper/helperBmMemberDay/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportHelperBmMemberDay(query) {
  return request({
    url: '/helper/helperBmMemberDay/export',
    method: 'get',
    params: query
  })
}
