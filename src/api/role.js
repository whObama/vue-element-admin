import request from '@/utils/request'

// export function getRoutes() {
//   return request({
//     url: '/vue-element-admin/routes',
//     method: 'get'
//   })
// }

// export function getRoles() {
//   return request({
//     url: '/vue-element-admin/roles',
//     method: 'get'
//   })
// }

// export function addRole(data) {
//   return request({
//     url: '/vue-element-admin/role',
//     method: 'post',
//     data
//   })
// }

// export function updateRole(id, data) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'put',
//     data
//   })
// }

// export function deleteRole(id) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'delete'
//   })
// }

// todo-----
export function getRoles(data) {
  return request({
    url: '/cms/role/queryRoleList',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/cms/role/deleteRoleList',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/cms/role/updateRoleInfo',
    method: 'post',
    data
  })
}

export function getMenuTree(data) {
  return request({
    url: '/cms/roleResource/queryRoleResourceList',
    method: 'post',
    data
  })
}

export function updateMenuTree(data) {
  return request({
    url: '/cms/roleResource/updateRoleResourceInfo',
    method: 'post',
    data
  })
}
