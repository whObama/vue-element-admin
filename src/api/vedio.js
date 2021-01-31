import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
export function queryVmsTrees() {
  return request({
    url: baseURL + '/datashow/video/queryVmsTrees',
    method: 'post'
  })
}
