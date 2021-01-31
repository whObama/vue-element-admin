<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col class="tree-left" :span="4" :offset="0">
        <div class="tree-container">
          <el-tree
            ref="tree"
            class="filter-tree"
            accordion
            :data="treeData"
            :props="defaultProps"
            node-key="index"
            :default-expanded-keys="defaultExpandeArr"
            :highlight-current="true"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" :offset="0">
        <div style="width: 50%; margin: 0 auto;">
          <el-form label-position="top" label-width="80px" :model="baseForm">
            <div class="form-group">
              <div class="form-group-title">记录保存时长</div>
              <el-form-item label="重点人员识别记录保存时长">
                <el-select style="width: 100%;" v-model="baseForm.importantSaveTime" placeholder="请选择重点人员识别记录保存时长">
                  <el-option v-for="item in importantList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="陌生人识别记录保存时长">
                <el-select style="width: 100%;" v-model="baseForm.strangerSaveTime" placeholder="请选择陌生人识别记录保存时长">
                  <el-option v-for="item in importantList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-group">
              <div class="form-group-title">地图服务地址</div>
              <el-form-item label="地图服务地址">
                <el-input v-model="baseForm.mapUrl" placeholder="请输入地图服务地址"></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button style="padding: 10px 40px;" type="primary" @click="subBaseForm">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { querySetting, modifySetting } from '@/api/controlConfig'
export default {
  data () {
    return {
      treeData: [
        {
          index: 1,
          name: '人脸设置',
          children: null
        },
        // {
        //   index: 2,
        //   name: '海康超脑引擎设置',
        //   children: null
        // }
      ],
      importantList: [
        { value: 1, label: '1个月' },
        { value: 3, label: '3个月' },
        { value: 6, label: '6个月' },
        { value: 9, label: '9个月' },
        { value: 12, label: '12个月' },
        { value: 18, label: '18个月' },
        { value: 24, label: '24个月' },
        { value: 30, label: '30个月' },
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultExpandeArr: [],
      // 基础设置表单
      baseForm: {
        importantSaveTime: 12,
        strangerSaveTime: 12,
        mapUrl: ''
      },
      // 海康超脑引擎设置表单
    }
  },
  mounted () {
    this.$nextTick().then(() => {
      const firstNode = document.querySelector(".el-tree-node")
      firstNode.click()
    })
  },
  methods: {
    handleNodeClick(data) {
      if (data.index === 1) {
        this.initBaseForm()
      } else {

      }
    },
    initBaseForm () {
      querySetting().then(
        res => {
          if (res.code === '0' && res.data) {
            this.baseForm = res.data
          }
        }
      ).catch(err=> console.log(err))
    },
    subBaseForm () {
      modifySetting(this.baseForm).then(
        res => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "保存成功"
            })
            this.initBaseForm()
          }
        }
      ).catch(err => console.log(err))
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.app-container {
  .tree-left {
    min-height: 805px;
    border-right: 1px solid #{$textColor1};
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
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgb(64, 158, 255) !important;
    color: #fff;
  }
  .app-page-content {
    padding: 0 0 10px;
    border-top: 1px solid #{$textColor1};
    border-bottom: 1px solid #{$textColor1};
    // display: flex;
    // flex-flow:row wrap;
    .face-img {
      position: relative;
      margin-top: 10px;
      border: 1px solid #{$textColor1};
      .facePic {
        width: 100%;
        // height: auto;
        height: 222px;
        border-bottom: 1px solid #{$textColor1};
        img {
          width: 100%;
          height: auto;
          // height: 222px;
        }
      }
      .text {
        display: flex;
        justify-content: space-between;
        height: 26px;
        line-height: 26px;
        padding: 0 5px;
        font-size: 14px;
        color: #{$textColor5};
        .el-icon-more {
          margin-top: 5px;
        }
      }
      &:hover {
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
      }
      .activeIcon {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 28px;
        height: 22px;
        background: url("../../assets/images/勾选.png") no-repeat;
        background-position: 100% 100%;
      }
    }
    .data-empty {
      margin-top: 10px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #{$textColor5};
    }
  }
  .mini-img {
    width: 60px;
    height: 60px;
    margin: 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
