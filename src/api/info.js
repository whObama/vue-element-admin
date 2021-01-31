import request from '@/utils/request'

export function deleteInfo(data) {
  return request({
    url: '/cms/user/deleteUserList',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  return request({
    url: '/cms/user/updateUserInfo',
    method: 'post',
    data
  })
}

export function queryInfoList(data) {
  return request({
    url: '/cms/user/queryUserList',
    method: 'post',
    data
  })
}

export function uploadFile(data) {
  return request({
    url: '/cms/user/uploadPersonFace',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    processData: false,
    contentType: false,
    data
  })
}
// 删除人员图片
export function removeFile(data) {
  return request({
    url: '/cms/person/uploadPersonFace',
    method: 'get',
    params: data
  })
}
