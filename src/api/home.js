import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询设备在线数量
export function queryDeviceStatus(data) {
  return request({
    url: baseURL + '/datashow/main/queryDeviceStatus',
    method: 'post',
    data
  })
}
// 查询人员数量
export function staticPersonNum(data) {
  return request({
    url: baseURL + '/datashow/main/staticPersonNum',
    method: 'post',
    data
  })
}
// 查询重点人员事件
export function mainPersonEvent(data) {
  return request({
    url: baseURL + '/datashow/main/queryEventList',
    method: 'post',
    data
  })
}
