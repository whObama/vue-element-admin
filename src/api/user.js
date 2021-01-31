import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/vue-element-admin/user/login",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/vue-element-admin/user/info",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/vue-element-admin/user/logout",
    method: "post"
  });
}
// todo-------
// export function login(data) {
//   return request({
//     url: '/cms/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/cms/user/queryUser',
//     method: 'post',
//     params: {}
//   })
// }
// // 获取权限路由
// export function getRouters(data) {
//   return request({
//     url: '/cms/user/queryUserDetailInfo',
//     method: 'post',
//     data
//   })
// }

// export function logout() {
//   return request({
//     url: '/cms/logout',
//     method: 'get'
//   })
// }
