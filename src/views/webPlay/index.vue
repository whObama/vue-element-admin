<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="tree-container">
          <!-- <div class="tool">
              <el-popover placement="bottom-start" ref="popover-add" width="300" trigger="click">
                <organization-edit :nodeData="currentNode" @closePoper="handlerClosePoper" />
                <el-button slot="reference" class="el-icon-plus" @click="handleAdd('add')" title="添加"></el-button>
              </el-popover>

              <el-popover placement="bottom-start" ref="popover-edit" width="300" trigger="click">
                <organization-edit :nodeData="currentNode" @closePoper="handlerClosePoper" />
                <el-button slot="reference" class="el-icon-edit" @click="handleEdit('edit')" title="修改"></el-button>
              </el-popover>

              <el-button class="el-icon-delete" :disabled="delDisabled" @click="handleDel"></el-button>

            </div> -->
          <el-input class="filter-tree-input" placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree class="filter-tree" accordion :data="treeData" :props="defaultProps" node-key="regionIndexCode"
            :default-expanded-keys="defaultExpandeArr" :highlight-current="true" :filter-node-method="filterNode"
            ref="tree" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i :class="data.icon"></i> {{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" id="view-container-col">
        <div class="view-container">
          <web-control-preview ref='webcontrolpreview' :webControlCustom='webControlCustom'>您的浏览器不支持 WebControl 插件
          </web-control-preview>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WebControlPreview from '@/components/WebControl/WebControlProview'
// import OrganizationEdit from './organization/OrganizationEdit'
import { queryVmsTrees } from '@/api/vedio'
export default {
  components: {
    WebControlPreview,
    // OrganizationEdit
  },
  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        icon: 'icon'
      },
      pageLoading: false,
      defaultExpandeArr: [],
      currentNode: {},
      webControlCustom: {
        offsetLeft: 0, // 窗口左侧偏移，这里是为了解决ISC框架下窗口偏移的问题
        offsetTop: 0,
        appkey: '', // 综合安防管理平台提供的appkey，必填
        secret: '', // 综合安防管理平台提供的secret，必填
        serverIp: '', // 综合安防管理平台IP地址，必填
        // cameraIndexCode: '', // 获取输入的监控点编号值，必填
        startTime: '', // 录像查询开始时间戳，单位：秒，视频回放必填
        endTime: '', // 录像结束开始时间戳，单位：秒，视频回放必填
        playMode: 0 // 初始播放模式：0-预览，1-回放
      },
      // 节点删除图标
      delDisabled: true
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    // closePoper () {
    //   console.log(111)
    // }
  },
  mounted () {
    this.queryVmsTrees()
    // this.$nextTick().then(() => {
    //   const firstNode = document.querySelector('.el-tree-node')
    //   firstNode.click()
    // })
  },
  methods: {
    async queryVmsTrees () {
      try {
        this.pageLoading = true
        const result = await queryVmsTrees()
        if (result && (result.code === '0' || result.code === 0)) {
          // this.webControlCustom = {
          //   ...this.webControlCustom,
          //   ...result.data.config,
          //   serverIp: result.data.config.serverIp || window.location.hostname // '10.1.219.39'
          // }
          this.webControlCustom = {
            offsetLeft: 0,
            offsetTop: 0,
            appkey: result.data.config.appkey,
            secret: result.data.config.secret,
            serverIp: result.data.config.serverIp || window.location.hostname,
            startTime: '',
            endTime: '',
            playMode: 0
          }
          setTimeout(() => {
            this.$refs.webcontrolpreview.initWebControl()
          }, 100)
          // this.menuDataList = result.data.treeDataList
          // if (this.menuDataList && this.menuDataList.length > 0) {
          //   this.treeData = this.menuDataList[0].treeData
          //   this.defaultExpandedArr = [this.treeData[0].name]
          // }
          this.treeData = result.data.treeDataList
          this.$nextTick().then(() => {
            const firstNode = document.querySelector('.el-tree-node')
            firstNode.click()
          })

        }
      } catch (err) {
        console.log(err)
      } finally {
        this.pageLoading = false
      }
    },
    handleAdd (type) {
      this.currentNode = {
        ...this.currentNode,
        type
      }

    },
    handleEdit (type) {
      this.currentNode = {
        ...this.currentNode,
        type
      }
    },
    handleDel () {
      this.hidePreview()
      this.$confirm('确定删除' + this.currentNode.label + '组织节点及其下级组织节点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let params = []
        // params.push(val.alarmSyscode)
        // delTableList(params).then(result => {
        //   if (result.code === '0') {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.initDatas()
        //   }
        // })
      }).catch(() => {
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (data) {
      this.currentNode = {
        id: data.id,
        label: data.label
      }
      if (this.currentNode && this.currentNode.id != 0) {
        this.delDisabled = false
      } else {
        this.delDisabled = true
      }
      if (data && data.children && data.children.length > 0) {
        let indexCodes = []
        data.children.forEach(item => {
          item.cameraIndexCode && (!item.children || item.children.length === 0) && indexCodes.push(item.cameraIndexCode)
        })
        indexCodes.length > 0 && this.startPreview({ indexCodes: indexCodes, noteType: 'nodelist' })
      } else if (data && data.cameraIndexCode) {
        this.startPreview({ indexCodes: [data.cameraIndexCode], noteType: 'node' })
      }
    },
    startPreview (preObj) {
      setTimeout(() => {
        this.$refs.webcontrolpreview.handleStartPreview(preObj)
      }, 100)
    },
    stopAllPreview () {
      this.$refs.webcontrolpreview.handleStopAllPreview()
    },
    hidePreview () {
      this.$refs.webcontrolpreview.hideWnd()
    },
    // 关闭proper
    handlerClosePoper (type) {
      this.$refs['popover-' + type].doClose()
    }
  },
  beforeDestroy () {
    // this.$refs.webcontrolpreview.handleStopAllPreview()
    this.$refs.webcontrolpreview.destroyWnd()
  }
}
</script>
<style lang="scss">
.app-container {
  .view-container {
    width: 1355px;
    height: 810px;
  }
  .tree-container {
    height: 100%;
    .filter-tree-input {
      margin-bottom: 10px;
      .el-input__inner {
        background: transparent;
      }
      .el-tree {
        // overflow: scroll;
        background: transparent;
        .el-tree-node {
          .el-tree-node__content {
            &:active,
            &:hover {
              background: #58aef5;
            }
          }
        }
        .is-current {
          background: #1890ff !important;
        }
      }
      .el-tree--highlight-current
        .el-tree-node.is-current:not(.is-drag)
        > .el-tree-node__content {
        background: #1890ff;
      }
      .is-current {
        background: #1890ff;
      }
    }
    .tool {
      margin-bottom: 10px;
      i {
        margin: 0 8px;
        padding: 2px;
        font-size: 18px;
      }
      i:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
<style lang="scss">
.app-container {
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgb(64, 158, 255) !important;
    color: #fff;
  }
  .el-button {
    border: 0;
  }
}
</style>
