import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 根据区域查询监控点
export function queryCameraByRegion(data) {
  return request({
    url: baseURL + '/datashow/camera/queryCameraByRegion',
    method: 'post',
    data
  })
}
// 根据区域查询设备
export function queryDeviceByRegion(data) {
  return request({
    url: baseURL + '/datashow/device/queryDeviceByRegion',
    method: 'post',
    data
  })
}
// 区域树查询
export function getTree(data) {
  return request({
    url: baseURL + '/datashow/region/getTree',
    method: 'post',
    data
  })
}
