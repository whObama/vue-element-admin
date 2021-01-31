<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-badge :value="12" class="item right-menu-item hover-effect">
          <i class="el-icon-bell" @click="handleAlarm" />
        </el-badge>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <div class="info-content">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <span class="info">{{ name }}</span>
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>项目简介</el-dropdown-item>
          </router-link> -->
          <router-link to="/">
            <el-dropdown-item>返回首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import store from '@/store'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  data () {
    return {
      // 预警信息路由
      alarmListRouter: ''
    }
  },
  mounted () {
    // console.log(this.name)
    this.initRouters()
  },
  methods: {
    async initRouters () {
      const accessRoutes = await store.dispatch('permission/getRouters')
      this.alarmListRouter = this.toPath(accessRoutes, 'alarmList')
    },
    toPath (accessRoutes, name) {
      let deviceRouterList = []
      let toPath = ''
      if (accessRoutes.length > 0) {
        accessRoutes.forEach(item => {
          if (item.children.length > 0) {
            item.children.map(i => {
              if (i.name === name) {
                deviceRouterList.push(item)
              }
            })
          }
        })
      }
      if (deviceRouterList.length > 0) {
        deviceRouterList[0].children.forEach(item => {
          if (item.name === name) {
            toPath = '/' + deviceRouterList[0].name + '/' + item.name
          }
        })
      } else {
        toPath = ''
      }
      return toPath
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=/dashboard`)
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleAlarm () {
      this.$router.push(this.alarmListRouter)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #f1f2f8;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      // color: #5a5e66;
      color: #{$iconColor1};
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .item {
      margin-right: 16px;
      color: #{$iconColor};
      font-size: 23px;
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .info-content {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
        .info {
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
