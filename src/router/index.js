import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "首页", icon: "el-icon-s-data", affix: true }
        // meta: { title: '首页', icon: 'chart', affix: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/vedio",
    component: Layout,
    redirect: "/personnel/page",
    meta: {
      title: "视频播放",
      icon: "el-icon-video-camera",
      roles: ["admin"] // you can set roles in root nav
    },
    children: [
      {
        path: "webPlay",
        component: () => import("@/views/webPlay/index"),
        name: "webPlay",
        meta: {
          title: "视频预览",
          roles: ["admin"]
        }
      },
      {
        path: "playback",
        component: () => import("@/views/playback/index"),
        name: "playback",
        meta: {
          title: "视频回放",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/personnel",
    component: Layout,
    redirect: "/personnel/page",
    alwaysShow: true, // will always show the root menu
    name: "personnel",
    meta: {
      title: "人员信息",
      icon: "el-icon-user",
      roles: ["admin"] // you can set roles in root nav
    },
    children: [
      {
        path: "personData",
        component: () => import("@/views/personData/index"),
        name: "PersonData",
        meta: {
          title: "人员管理",
          roles: ["admin"]
        }
      },
      {
        path: "infoData",
        component: () => import("@/views/infoData/index"),
        name: "InfoData",
        meta: {
          title: "用户管理",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/menuConfig",
    component: Layout,
    redirect: "/menuConfig/page",
    alwaysShow: true, // will always show the root menu
    name: "menuConfig",
    meta: {
      title: "菜单配置",
      icon: "el-icon-menu",
      roles: ["admin"] // you can set roles in root nav
    },
    children: [
      {
        path: "firstMenu",
        component: () => import("@/views/firstMenu/index"),
        name: "firstMenu",
        meta: {
          title: "一级菜单",
          roles: ["admin"]
        }
      },
      {
        path: "secondMenu",
        component: () => import("@/views/secondMenu/index"),
        name: "secondMenu",
        meta: {
          title: "二级菜单",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/page",
    alwaysShow: true, // will always show the root menu
    name: "permission",
    meta: {
      title: "系统设置",
      icon: "el-icon-setting",
      roles: ["admin", "editor"] // you can set roles in root nav
    },
    children: [
      {
        path: "role",
        component: () => import("@/views/role/index"),
        name: "role",
        meta: {
          title: "角色管理",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/listManagement",
    component: Layout,
    redirect: "/listManagement/page",
    alwaysShow: true, // will always show the root menu
    name: "listManagement",
    meta: {
      title: "名单管理",
      icon: "el-icon-s-custom",
      roles: ["admin", "editor"] // you can set roles in root nav
    },
    children: [
      // {
      //   path: "blacklist",
      //   component: () => import("@/views/blacklist/index"),
      //   name: "blacklist",
      //   meta: {
      //     title: "黑名单",
      //     roles: ["admin"]
      //   }
      // },
      {
        path: "faceGroup",
        component: () => import("@/views/faceGroup/index"),
        name: "faceGroup",
        meta: {
          title: "人脸分组",
          roles: ["admin"]
        }
      },
      {
        path: "alarmList",
        component: () => import("@/views/alarmList/index"),
        name: "alarmList",
        meta: {
          title: "预警信息",
          roles: ["admin"]
        }
      },
      {
        path: "device",
        component: () => import("@/views/device/index"),
        name: "device",
        meta: {
          title: "设备信息",
          roles: ["admin"]
        }
      },
      {
        path: "mainPersonEvent",
        component: () => import("@/views/mainPersonEvent/index"),
        name: "mainPersonEvent",
        meta: {
          title: "重点人事件",
          roles: ["admin"]
        }
      },
      {
        path: "strangerEvent",
        component: () => import("@/views/strangerEvent/index"),
        name: "strangerEvent",
        meta: {
          title: "陌生人事件",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/control",
    component: Layout,
    redirect: "/control/page",
    alwaysShow: true, // will always show the root menu
    name: "control",
    meta: {
      title: "综合管控配置",
      icon: "el-icon-menu",
      roles: ["admin", "editor"] // you can set roles in root nav
    },
    children: [
      {
        path: "controlConfig",
        component: () => import("@/views/controlConfig/index"),
        name: "controlConfig",
        meta: {
          title: "参数配置",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/map",
    component: Layout,
    redirect: "/map/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/map/index"),
        name: "map",
        meta: {
          title: "轨迹地图",
          icon: "el-icon-map-location",
          roles: ["admin", "editor"] // you can set roles in root nav
        },
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
