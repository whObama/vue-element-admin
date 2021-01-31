import request from '@/utils/request'

export function deleteInfo(data) {
  return request({
    url: '/cms/resource/deleteResourceList',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/cms/resource/updateResourceInfo',
    method: 'post',
    data
  })
}

export function queryMenuList(data) {
  return request({
    url: '/cms/resource/queryResourceList',
    method: 'post',
    data
  })
}

export function queryMenuChildList(data) {
  return request({
    url: '/cms/resource/queryResourceChildList',
    method: 'post',
    data
  })
}

export function getRoles(data) {
  return request({
    url: '/cms/role/queryPremissonByRole',
    method: 'post',
    data
  })
}
