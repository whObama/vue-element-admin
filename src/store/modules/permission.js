import { asyncRoutes, constantRoutes } from '@/router'
import { getRouters } from '@/api/user'
import Layout from '@/layout'
// import { reject } from 'core-js/fn/promise'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

export function secondMenu(childs) {
  const res = []
  const keys = ['path', 'name', 'children', 'redirect', 'meta', 'hidden']
  childs.forEach(item => {
      const newItem = {}
      newItem.path = item.resourceCode
      newItem.component = resolve => require([`@/views/${item.resourceCode}/index`],resolve)
      newItem.name = item.resourceCode,
      newItem.meta = {
        title: item.resourceName
      }
      res.push(newItem)
  })
  return res
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  getRouters({ commit }) {
    return new Promise((resolve, reject) => {
      let accessedRoutes = []
      getRouters().then(res => {
        const { data } = res
        if (!data) {
          reject('获取用户菜单权限失败,请重新登录!')
        }
        const { menuInfo } = data

        if (menuInfo && menuInfo.length > 0) {
          menuInfo.forEach(item => {
            if (item.childs && item.childs.length > 0) {
              accessedRoutes.push({
                path: '/' + item.resourceCode,
                redirect: `/${item.resourceCode}/page`,
                component: Layout,
                alwaysShow: true,
                name: item.resourceCode,
                meta: {
                  title: item.resourceName,
                  icon: item.resourceIcon,
                },
                children: secondMenu(item.childs)
              })
            } else {
              accessedRoutes.push(
                {
                  path: '/' + item.resourceCode,
                  component: Layout,
                  children: [
                    {
                      path: 'index',
                      component: resolve => require([`@/views/${item.resourceCode}/index`],resolve),
                      meta: { title: item.resourceName, icon: item.resourceIcon, noCache: true}
                    }
                  ]
                }
              )
            }
          })
        } else {
          accessedRoutes = []
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
