export default [
  {
    title: '人员管理',
    name: 'personData',
    component: 'personData'
  },
  {
    title: '用户管理',
    name: 'infoData',
    component: 'infoData'
  },
  {
    title: '一级菜单',
    name: 'firstMenu',
    component: "() => import('@/views/menuConfig/firstMenu')"
  },
  {
    title: '二级菜单',
    name: 'secondMenu',
    component: "() => import('@/views/menuConfig/secondMenu')"
  },
  {
    title: '角色管理',
    name: 'role',
    component: 'role'
  },
] 