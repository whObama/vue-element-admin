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
            node-key="faceGroupId"
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
        <div class="search-box">
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="search-item">
                <div class="label" style="width: 80px;">姓名</div>
                <el-input
                  v-model="search.faceName"
                  class="input-area"
                  placeholder="请输入姓名"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="5">
              <div class="search-item">
                <div class="label" style="width: 80px;">性别</div>
                <el-select
                  v-model="search.gender"
                  placeholder="请选择"
                  class="input-area"
                >
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <!-- <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">手机号码</div>
            <el-input
              class="input-area"
              placeholder="请输入手机号码"
              v-model="search.phone"
              clearable>
            </el-input>
          </div>
        </el-col> -->
            <el-col :span="5">
              <div class="search-item">
                <div class="label" style="width: 80px;">证件类型</div>
                <el-select
                  v-model="search.idType"
                  placeholder="请选择"
                  class="input-area"
                >
                  <el-option
                    v-for="item in certTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="search-item" style="margin-right: 0px">
                <div class="label" style="width: 80px;">证件号码</div>
                <el-input
                  v-model="search.idNo"
                  class="input-area"
                  placeholder="请输入证件号码"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="4">
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

          <!-- <el-row>
        <el-col :span="24">
          <div class="button-content">
            <div class="button-box">
              <el-button type="primary" @click="searchSubmit">确定查询</el-button>
              <el-button type="warning" @click="resetSearch">取消查询</el-button>
            </div>
          </div>
        </el-col>
      </el-row> -->
        </div>
        <el-button
          class="top-button"
          type="grey"
          icon="el-icon-upload2"
          @click="uploadFace"
          >导入人脸</el-button
        >
        <el-button
          class="top-button"
          type="danger"
          :disabled="removeDisabled"
          @click="removeMore"
          >删除人脸</el-button
        >

        <div class="app-page-content">
          <div v-if="list.length === 0" class="data-empty">
            暂无数据
          </div>
          <el-row v-else :gutter="10">
            <!-- <el-row :gutter="10"> -->
            <el-col v-for="item in list" :key="item.id" :span="3">
              <div class="face-img" @click="handleFace(item)">
                <!-- <img src="../../assets/images/火影.jpg" alt=""> -->
                <div class="facePic">
                  <img
                    :src="
                      host+item.picUrl
                    "
                    alt=""
                  />
                </div>
                <div class="text">
                  <span class="name">{{ item.faceName }}</span>
                  <i class="el-icon-more" />
                </div>
                <!-- <div :class="item.type === form.type ? 'activeIcon' : ''"></div> -->
                <div :class="activeFace === item.id ? 'activeIcon' : ''" />
              </div>
            </el-col>
          </el-row>
        </div>
        <el-pagination
          style="width: 100%;"
          :current-page="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <el-dialog width="70%" :visible.sync="dialogVisible" title="添加人脸">
      <el-form ref="form" class="demo-ruleForm">
        <el-table
          :data="faceTable"
          max-height="350"
          style="width: 100%;"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="性别" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.gender === 1">男</span>
              <span v-else-if="scope.row.gender === 2">女</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证件类型">
            <template slot-scope="scope">
              <span v-if="scope.row.certType == 111">身份证</span>
              <span v-else-if="scope.row.certType == 131">工作证</span>
              <span v-else-if="scope.row.certType == 335">驾驶证</span>
              <span v-else-if="scope.row.certType == 113">户口本</span>
              <span v-else-if="scope.row.certType == 133">学生证</span>
              <span v-else>其他</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证件号码">
            <template slot-scope="scope">
              {{ scope.row.certNo }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="工号">
            <template slot-scope="scope">
              {{ scope.row.jobNo }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号码">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="描述">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="人员图片" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.faceUrl" class="mini-img">
                <!-- <img :src="'http://10.192.93.114:17011/datashow/download/static/' + scope.row.faceUrl" alt="" /> -->
                <el-image
                  style="width: 100%; height: 100%"
                  :src="
                    host+scope.row.faceUrl
                  "
                  :preview-src-list="[
                    host+scope.row.faceUrl
                  ]"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div style="text-align:right;margin-top: 20px;">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button type="danger" @click="resetForm('form')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryFaceGroups,
  addFace,
  queryFace,
  queryNotAddPerson,
  deleteFace
} from "@/api/faceGroup";

export default {
  data() {
    return {
      sexList: [
        {
          value: 3,
          label: "全部"
        },
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        },
        {
          value: 0,
          label: "未知"
        }
      ],
      certTypeList: [
        {
          value: 111,
          label: "身份证"
        },
        {
          value: 131,
          label: "工作证"
        },
        {
          value: 335,
          label: "驾驶证"
        },
        {
          value: 113,
          label: "户口本"
        },
        {
          value: 133,
          label: "学生证"
        },
        {
          value: 990,
          label: "其他"
        }
      ],
      formSexList: [
        {
          value: 0,
          label: "未知"
        },
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        }
      ],
      search: {
        faceName: "",
        gender: 3,
        idType: 111,
        idNo: ""
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
        children: "children",
        label: "faceGroupName"
      },
      defaultExpandeArr: [],
      currentNode: {},
      faceGroupId: "",
      // 人脸弹窗
      dialogVisible: false,
      faceTable: [],
      multipleSelectData: [],
      // 人脸图片选中
      removeSelect: null,
      activeFace: "",
      removeDisabled: true,
      host: {}
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    activeFace: function (val) {
      if (val) {
        this.removeDisabled = false
      } else {
        this.removeDisabled = true
      }
    }
  },
  created() {
    // this.host = window.location.host + '/datashow/download/static/'
    this.host = 'http://10.192.93.114:17012/cms/download/static/'
    this.initTree();
  },
  methods: {
    initTree() {
      queryFaceGroups()
        .then(res => {
          if (res.code === "0") {
            if (res.data.length > 0) {
              const arr = [];
              res.data.forEach(item => {
                arr.push({
                  ...item,
                  children: []
                });
              });
              this.treeData = arr;
              this.$nextTick().then(() => {
                const firstNode = document.querySelector(".el-tree-node");
                firstNode.click();
                this.getList();
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
      this.faceGroupId = data.faceGroupId;
      this.activeFace = "";
      this.removeDisabled = true;
      this.getList();
    },
    async getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        faceGroupId: this.faceGroupId,
        ...this.search
      };
      const res = await queryFace(params);
      this.list = res.data.list ? res.data.list : [];
      this.total = res.data.total;
    },
    searchSubmit() {
      this.getList();
    },
    resetSearch() {
      this.search.faceName = "";
      this.search.gender = 3;
      this.search.idType = 111;
      this.search.idNo = "";
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    uploadFace() {
      const params = {
        faceGroupId: this.faceGroupId
      };
      queryNotAddPerson(params)
        .then(res => {
          if (res.code === "0") {
            this.dialogVisible = true;
            this.faceTable = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelectData = val;
    },
    submitForm(formName) {
      if (this.multipleSelectData.length <= 0) {
        return this.$message({
          type: "error",
          message: "请选择人员"
        });
      }
      const arr = [];
      this.multipleSelectData.forEach(item => {
        if (item.faceUrl) {
          arr.push(item);
        }
      });
      if (arr.length <= 0) {
        return this.$message({
          type: "error",
          message: "请选择有人员照片的人员"
        });
      }
      const params = [];
      arr.forEach(item => {
        params.push({
          faceGroupIndexCode: this.faceGroupId,
          indexCode: item.indexCode
        });
      });

      addFace(params)
        .then(res => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.dialogVisible = false;
            this.getList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetForm(formName) {
      this.dialogVisible = false;
    },
    handleFace(val) {
      // this.removeDisabled = false;
      this.activeFace = val.id;
      this.removeSelect = val;
    },
    removeMore() {
      const row = this.removeSelect;
      this.$confirm("确定删除" + row.faceName + "吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = [];
          params.push(row.faceId);
          deleteFace({
            faceGroupIndexCode: row.faceGroupId,
            indexCodes: params
          })
            .then(result => {
              if (result.code === "0") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.activeFace = ''
                this.getList();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
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
