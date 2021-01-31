<template>
  <div class="app-container">
    <div class="search-box">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">所在区域</div>
            <treeselect
              v-model="value"
              class="input-area"
              :multiple="true"
              :options="treeData"
              placeholder="请选择所在区域"
              :normalizer="normalizer"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">事件源</div>
            <el-input
              v-model="search.srcName"
              class="input-area"
              placeholder="请输入事件源"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">事件等级</div>
            <el-select
              v-model="search.eventLevels"
              multiple
              placeholder="请选择"
              class="input-area"
              clearable
            >
              <el-option
                v-for="item in eventLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">开始时间</div>
            <el-date-picker
              v-model="search.startTime"
              class="input-area"
              type="datetime"
              placeholder="选择开始时间"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">结束时间</div>
            <el-date-picker
              v-model="search.endTime"
              class="input-area"
              type="datetime"
              placeholder="选择结束时间"
            />
          </div>
        </el-col>
        <!-- <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">角色名称</div>
           <el-select v-model="search.roleCode" placeholder="请选择" class="input-area">
              <el-option
                v-for="item in rolesList"
                :key="item.roleCode"
                :label="item.roleName"
                :value="item.roleCode">
              </el-option>
            </el-select>
          </div>
        </el-col> -->
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
    </div>

    <el-table :data="list" style="width: 100%; margin-top: 15px;" border>
      <el-table-column align="center" label="所在区域">
        <template slot-scope="scope">
          {{ scope.row.regionName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="事件名称">
        <template slot-scope="scope">
          {{ scope.row.eventName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="事件等级" width="110">
        <template slot-scope="scope">
          <span
            v-if="scope.row.eventLvl === 1"
            class="eventLv1"
            style="background-color: rgba(76, 166, 34)"
            >低</span
          >
          <span
            v-else-if="scope.row.eventLvl === 2"
            class="eventLv1"
            style="background-color: rgba(211, 121, 0)"
            >中</span
          >
          <span
            v-else-if="scope.row.eventLvl === 3"
            class="eventLv1"
            style="background-color: rgba(191, 49, 48)"
            >高</span
          >
          <span v-else class="eventLv1">未配置</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="事件源">
        <template slot-scope="scope">
          {{ scope.row.srcName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          {{
            scope.row.happenTime
              ? scope.row.happenTime.substring(0, 10) +
                " " +
                scope.row.happenTime.substring(11, 19)
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          {{
            scope.row.stopTime
              ? scope.row.stopTime.substring(0, 10) +
                " " +
                scope.row.stopTime.substring(11, 19)
              : ""
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="用户图片" width="80">
        <template slot-scope="scope">
          <div class="mini-img">
            <el-image
              style="width: 100%; height: 100%"
              :src="scope.row.faceUrl"
              :preview-src-list="[scope.row.faceUrl]">
            </el-image>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="事件详情" width="150">
        <template slot-scope="scope">
          <i
            title="事件详情"
            class="el-icon-tickets"
            @click="handleDetail(scope.row)"
          />
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
    />

    <el-dialog
      class="eventDetail"
      width="50%"
      :visible.sync="dialogVisible"
      title="事件详情"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { query, queryLinkResult, getTree } from "@/api/alarmList";
import moment from "moment";
export default {
  components: { Treeselect },
  data() {
    return {
      rolesList: [],
      eventLevelList: [
        {
          value: 1,
          label: "低"
        },
        {
          value: 2,
          label: "中"
        },
        {
          value: 3,
          label: "高"
        }
      ],
      search: {
        srcName: "",
        eventLevels: [],
        startTime: "",
        endTime: ""
      },
      list: [],
      dialogVisible: false,
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      // 区域树
      treeData: [],
      value: [],
      normalizer(node) {
        // 去掉children=null的属性
        if (node.child == null) {
          delete node.child;
        }
        return {
          id: node.indexCode,
          label: node.name,
          children: node.child
        };
      }
    };
  },
  computed: {},
  watch: {
    value: function(val) {
      console.log(val);
    }
  },
  created() {
    this.initTree();
    this.getList();
  },
  methods: {
    initTree() {
      getTree().then(res => {
        if (res.code === "0") {
          if (res.data) {
            this.treeData = [res.data];
          } else {
            this.treeData = [];
          }
        }
      });
    },
    async getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        regionIndexCodes: this.value,
        ...this.search
      };
      const res = await query(params);
      this.list = res.data.list;
      this.total = res.data.total;
    },
    searchSubmit() {
      const start = Date.parse(this.search.startTime);
      const end = Date.parse(this.search.endTime);
      if (start > end) {
        this.$message({
          message: "查询数据失败，开始时间不能大于结束时间",
          type: "error"
        });
        return false;
      } else {
        this.search.startTime = this.search.startTime
          ? moment(this.search.startTime).format("YYYY-MM-DD hh:mm:ss")
          : "";
        this.search.endTime = this.search.endTime
          ? moment(this.search.endTime).format("YYYY-MM-DD hh:mm:ss")
          : "";
      }
      this.getList();
    },
    resetSearch() {
      this.search.srcName = "";
      this.search.eventLevels = [];
      this.search.startTime = "";
      this.search.endTime = "";
      this.value = [];
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
    handleDetail(val) {
      console.log(val);
      this.dialogVisible = true;
      queryLinkResult({ eventId: val.eventId })
        .then(res => {
          if (res.code === "0") {
            console.log(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateInfo(this.form)
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
        } else {
          // this.$refs[formName].resetFields()
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.app-container {
  min-height: 845px;
  .mini-img {
    width: 60px;
    height: 60px;
    margin: 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    // width: 178px;
    // height: 178px;
    // line-height: 178px;
    width: 96px;
    height: 96px;
    line-height: 96px;
    text-align: center;
  }
  .avatar {
    width: 96px;
    height: 96px;
    // width: 178px;
    // height: 178px;
    display: block;
  }
  .el-upload:hover .upload-delete {
    display: inline-block;
  }
  .upload-delete {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #f4f4f4;
    display: none;
  }
  // 事件等级
  .eventLv1 {
    display: inline-block;
    padding: 2px 30px;
    color: rgba(255, 255, 255, 1);
  }
  // 区域树
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    font-size: 14px;
  }
  .vue-treeselect__menu-container {
    font-family: "PingFang SC";
    font-size: 14px;
    font-weight: 300;
    color: #{$textColor3};
  }
  .eventDetail {
    .el-dialog__header {
      border-bottom: 1px solid #{$textColor1};
    }
  }
}
</style>
