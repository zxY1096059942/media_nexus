import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listHelperBmMemberAppDay(query, pageReq) {
  return request({
    url: '/helper/helperBmMemberAppDay/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询【请填写功能名称】详细
export function getHelperBmMemberAppDay(id) {
  return request({
    url: '/helper/helperBmMemberAppDay/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addHelperBmMemberAppDay(data) {
  return request({
    url: '/helper/helperBmMemberAppDay',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateHelperBmMemberAppDay(data) {
  return request({
    url: '/helper/helperBmMemberAppDay',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delHelperBmMemberAppDay(id) {
  return request({
    url: '/helper/helperBmMemberAppDay/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportHelperBmMemberAppDay(query) {
  return request({
    url: '/helper/helperBmMemberAppDay/export',
    method: 'get',
    params: query
  })
}
