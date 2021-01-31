import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 事件插叙
export function query(data) {
  return request({
    url: baseURL + '/datashow/event/query',
    method: 'post',
    data
  })
}
// 联动结果查询
export function queryLinkResult(data) {
  return request({
    url: baseURL + '/datashow/event/queryLinkResult',
    method: 'get',
    params: data
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
// 监控点树查询
export function queryVmsTrees(data) {
  return request({
    url: baseURL + '/datashow/video/queryVmsTrees',
    method: 'post',
    data
  })
}
// 重点人事件
export function queryImportantEvent(data) {
  return request({
    url: baseURL + '/datashow/event/queryImportantEvent',
    method: 'post',
    data
  })
}
// 陌生人事件
export function queryStrangerEvent(data) {
  return request({
    url: baseURL + '/datashow/stranger/queryStrangerEvent',
    method: 'post',
    data
  })
}
