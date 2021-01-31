import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 获取参数配置
export function querySetting(data) {
  return request({
    url: baseURL + '/datashow/ui/setting/querySetting',
    method: 'get',
    params: data
  })
}
// 参数配置修改
export function modifySetting(data) {
  return request({
    url: baseURL + '/datashow/ui/setting/modifySetting',
    method: 'post',
    data
  })
}
