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
  {
    title: '视频预览',
    name: 'webPlay',
    component: 'webPlay'
  },
  {
    title: '视频回放',
    name: 'playback',
    component: 'playback'
  },
  {
    title: '人脸分组',
    name: 'faceGroup',
    component: 'faceGroup'
  },
  {
    title: '预警信息',
    name: 'alarmList',
    component: 'alarmList'
  },
  {
    title: '设备信息',
    name: 'device',
    component: 'device'
  },
  {
    title: '重点人事件',
    name: 'mainPersonEvent',
    component: 'mainPersonEvent'
  },
  {
    title: '陌生人事件',
    name: 'strangerEvent',
    component: 'strangerEvent'
  },
  {
    title: '参数配置',
    name: 'controlConfig',
    component: 'controlConfig'
  },
]