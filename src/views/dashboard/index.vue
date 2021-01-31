<template>
  <div class="home-container">
    <el-row class="left">
      <el-col :span="18">
        <el-row type="flex">
          <el-col :span="8">
            <el-card class="top-left" style="margin-right: 8px">
              <div slot="header" class="clearfix">
                <span style="font-weight: 700; color: variables.textColor10"
                  >设备在线/离线数</span
                >
              </div>
              <div class="height-light-shadow">
                <device-chart
                  id="device-chart"
                  width="100%"
                  height="307px"
                  :device-data="deviceData"
                  :deviceRouter='deviceRouter'
                />
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="person-num-card" style="margin-right: 8px">
              <div slot="header" class="clearfix">
                <span style="font-weight: 700; color: variables.textColor10"
                  >重点人员统计</span
                >
              </div>
              <div class="height-light-shadow">
                <div class="data-time">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <person-chart
                  id="PersonChart"
                  :data-type="value"
                  :mianPersonRouter='mianPersonRouter'
                  width="100%"
                  height="307px"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="top-left" style="margin: 8px 8px 0 0;">
              <div slot="header" class="clearfix">
                <span style="font-weight: 700; color: variables.textColor10"
                  >预警信息</span
                >
              </div>
              <div>
                <alert-event
                  id="alertEvent"
                  :alart-table="alartTable"
                  :alarmListRouter='alarmListRouter'
                  width="100%"
                  height="338px"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-card class="important-person-container">
          <div slot="header" class="clearfix">
            <span style="font-weight: 700; color: variables.textColor10"
              >重点人事件</span
            >
          </div>
          <important-person
            width="100%"
            :mian-person-data="mianPersonData"
            :mianPersonRouter='mianPersonRouter'
            height="749px"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- <div class="right">
      <el-card>
        <div slot="header" class="clearfix">
          <span style="font-weight: 700; color: variables.textColor10">重点人事件</span>
        </div>
          <important-person width="376px" height="749px" />
      </el-card>
    </div> -->
  </div>
</template>

<script>
import variables from "@/styles/variables.scss";
import DeviceChart from "@/components/Charts/DeviceChart";
import PersonChart from "@/components/Charts/PersonChart";
import ImportantPerson from "@/components/Charts/ImportantPerson";
import AlertEvent from "@/components/Charts/AlertEvent";
import { mainPersonEvent, queryDeviceStatus } from "@/api/home";
import store from '@/store'
export default {
  components: {
    DeviceChart,
    PersonChart,
    ImportantPerson,
    AlertEvent
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: "近7天"
        },
        {
          value: 1,
          label: "近30天"
        },
        {
          value: 2,
          label: "近半年"
        }
      ],
      value: 0,
      ws: {},
      host: {},
      // 设备在线/离线
      deviceData: {},
      // 预警列表
      alartTable: [],
      // 重点人事件
      mianPersonData: [],
      // 设备路由
      deviceRouter: '',
      // 重点人路由
      mianPersonRouter: '',
      // 预警信息路由
      alarmListRouter: ''
    };
  },
  mounted() {
    this.initRouters()
    this.initDeviceData();
    this.initMainPersonData();
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async initRouters () {
      const accessRoutes = await store.dispatch('permission/getRouters')
      this.deviceRouter = this.toPath(accessRoutes, 'device')
      this.mianPersonRouter = this.toPath(accessRoutes, 'mainPersonEvent')
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
    initDeviceData() {
      queryDeviceStatus({})
        .then(res => {
          if (res.code === "0") {
            this.deviceData = res.data;
          }
        })
        .catch(err => {
          console.log("请求失败" + err);
        });
    },
    initMainPersonData() {
      mainPersonEvent()
        .then(res => {
          if (res.code === "0") {
            this.alartTable = res.data.linkEventInfoList;
            this.mianPersonData = res.data.importantPersonEventList;
            if (this.alartTable.length > 7) {
              this.alartTable.pop();
            }
            if (this.mianPersonData.length > 3) {
              this.mianPersonData.pop();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    init() {
      // this.host = window.location.host
      this.host = "10.192.93.114:17011";
      const that = this;
      const wsUrl =
        window.location.protocol === "https:"
          ? `wss://${this.host}/datashow/websocket`
          : `ws://${this.host}/datashow/websocket`;
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = function() {};
      this.ws.onmessage = function(evt) {
        if (evt && evt.data) {
          const result = JSON.parse(evt.data);
          if (result.linkageVo) {
            that.alartTable.unshift(result.linkageVo);
            if (that.alartTable.length > 7) {
              that.alartTable.pop();
            }
          }
          if (result.importantPersonEventVo) {
            that.mianPersonData.unshift(result.importantPersonEventVo);
            if (that.mianPersonData.length > 3) {
              that.mianPersonData.pop();
            }
          }
          if (result.onlineVo) {
            that.deviceData = result.onlineVo;
          }
        }
      };

      this.ws.onclose = function(evt) {};

      this.ws.onerror = function(evt) {
        alert("与后台服务断开,请刷新页面");
        // location.reload()
      };
    },
    send() {
      this.ws.send();
    }
  }
};
</script>
<style lang="scss">
.home-container {
  display: flex;
  // height: 100%;
  min-height: 845px;
  width: 100%;
  .left {
    // width: 100%;
    flex: 1;
  }
  .right {
    width: 418px;
    .el-card {
      width: 100%;
    }
  }
  .person-num-card {
    position: relative;
    .data-time {
      position: absolute;
      right: 24px;
      top: 78px;
      z-index: 100;
    }
  }
  .important-person-container {
    min-width: 376px !important;
  }
  .height-light-shadow {
    &:hover {
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
