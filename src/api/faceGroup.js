import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询人脸分组
export function queryFaceGroups(data) {
  return request({
    url: baseURL + '/datashow/group/queryFaceGroups',
    method: 'get',
    params: data
  })
}
// 从人员中添加人脸
export function addFace(data) {
  return request({
    url: baseURL + '/datashow/face/addFace',
    method: 'post',
    data
  })
}
// 查询人脸
export function queryFace(data) {
  return request({
    url: baseURL + '/datashow/face/queryFace',
    method: 'post',
    data
  })
}
// 查询尚未添加人脸的人员
export function queryNotAddPerson(data) {
  return request({
    url: baseURL + '/datashow/face/queryNotAddPerson',
    method: 'get',
    params: data
  })
}

// 查询尚未添加人脸的人员
export function deleteFace(data) {
  return request({
    url: baseURL + '/datashow/face/deleteFace',
    method: 'post',
    data
  })
}
