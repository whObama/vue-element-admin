<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col class="tree-left" :span="4" :offset="0">
        <div class="tree-container">
          <el-input
            v-model="filterText"
            class="filter-tree-input"
            placeholder="输入关键字进行过滤"
          />
          <el-tree
            ref="tree"
            class="filter-tree"
            accordion
            :data="treeData"
            :props="defaultProps"
            node-key="indexCode"
            :default-expanded-keys="defaultExpandeArr"
            :highlight-current="true"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" :offset="0">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="设备" name="first">
            <device-list :index-code="indexCode" />
          </el-tab-pane>
          <el-tab-pane label="监控点" name="second">
            <camera-list :index-code="indexCode" />
          </el-tab-pane>
        </el-tabs>
        <!-- <div class="search-box">
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="search-item">
                <div class="label" style="width: 80px;">设备名称</div>
                <el-input
                  v-model="search.name"
                  class="input-area"
                  placeholder="请输入设备名称"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="19">
              <div class="button-content">
                <div class="button-box">
                  <el-button type="primary" @click="searchSubmit"
                    >确定查询</el-button
                  >
                  <el-button type="warning" @click="resetSearch"
                    >取消查询</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="list"
          max-height="350"
          style="width: 100%;margin-top: 15px;"
          border
        >
          <el-table-column align="center" label="设备名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备ip">
            <template slot-scope="scope">
              {{ scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备端口">
            <template slot-scope="scope">
              {{ scope.row.port }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="用户名">
            <template slot-scope="scope">
              {{ scope.row.userName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              {{
                scope.row.createTime
                  ? scope.row.createTime.substring(0, 10) +
                    " " +
                    scope.row.createTime.substring(11, 19)
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="更新时间">
            <template slot-scope="scope">
              {{
                scope.row.modifyTime
                  ? scope.row.modifyTime.substring(0, 10) +
                    " " +
                    scope.row.modifyTime.substring(11, 19)
                  : ""
              }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="width: 100%;"
          :current-page="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTree } from "@/api/device";
import DeviceList from "./DeviceList";
import CameraList from "./CameraList";
export default {
  components: {
    DeviceList,
    CameraList
  },
  data() {
    return {
      search: {
        name: ""
      },
      action: "",
      num32: 32,
      num11: 11,
      list: [],
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      filterText: "",
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      defaultExpandeArr: [],
      currentNode: {},
      indexCode: "",
      activeName: "first"
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.initTree();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab);
    },
    initTree() {
      getTree()
        .then(res => {
          if (res.code === "0") {
            if (res.data) {
              this.treeData = [res.data];
              this.$nextTick().then(() => {
                const firstNode = document.querySelector(".el-tree-node");
                firstNode.click();
              });
            } else {
              this.treeData = [];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.indexCode = data.indexCode;
    }
  }
};
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
      img {
        width: 100%;
        // height: auto;
        height: 222px;
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
        box-shadow: 0 6px 16px 0;
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
