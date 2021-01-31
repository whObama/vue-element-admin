import request from '@/utils/request'

export function addPerson(data) {
  return request({
    url: '/cms/person/addPerson',
    method: 'post',
    data
  })
}

export function deletePerson(data) {
  return request({
    url: '/cms/person/deletePerson',
    method: 'post',
    data
  })
}

export function updatePerson(data) {
  return request({
    url: '/cms/person/modifyPerson',
    method: 'post',
    data
  })
}

export function queryPersonList(data) {
  return request({
    url: '/cms/person/queryPersonList',
    method: 'post',
    data
  })
}

export function uploadFile(data) {
  return request({
    url: '/cms/person/uploadPersonFace',
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
    method: 'post',
    data
  })
}
// 查询组织树
export function queryOrgTree(data) {
  return request({
    url: '/cms/org/queryOrgTree',
    method: 'post',
    data
  })
}
// 添加组织
export function addOrg(data) {
  return request({
    url: '/cms/org/addOrg',
    method: 'post',
    data
  })
}
// 修改组织
export function modifyOrg(data) {
  return request({
    url: '/cms/org/modifyOrg',
    method: 'post',
    data
  })
}
// 删除组织
export function deleteOrg(data) {
  return request({
    url: '/cms/org/deleteOrg',
    method: 'post',
    data
  })
}
// 导出人员信息
export function exportPerson(data) {
  return request({
    url: '/cms/person/exportPerson',
    method: 'post',
    data
  })
}
// 人员基本信息导入csv文件校验
export function checkImportCsv(data) {
  return request({
    url: '/cms/person/checkImportCsv',
    method: 'post',
    data
  })
}
// 导入人员信息
export function importPersonBaseMsg(data) {
  return request({
    url: '/cms/person/importPersonBaseMsg',
    method: 'post',
    data
  })
}
// 导入人员图片
export function checkImageZip(data) {
  return request({
    url: '/cms/person/checkImageZip',
    method: 'post',
    data
  })
}
// 导入人员图片
export function importPersonImg(data) {
  return request({
    url: '/cms/person/importPersonImg',
    method: 'post',
    data
  })
}
