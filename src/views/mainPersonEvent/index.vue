<template>
  <div class="app-container">
    <div class="search-box">
      <el-row :gutter="20">
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
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">抓拍点</div>
            <treeselect
              v-model="value"
              class="input-area"
              :multiple="true"
              :options="treeData"
              placeholder="请选择抓拍点"
              :normalizer="normalizer"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">相似度(%)</div>
            <el-slider
              v-model="search.similary"
              class="input-area similay"
              show-input
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">姓名</div>
            <el-input
              v-model="search.personName"
              class="input-area"
              placeholder="请输入姓名"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="4">
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
      </el-row>
      <el-row :gutter="20" style="marginTop: 15px;">
        <el-col :span="4">
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
        <el-col :span="4">
          <div class="search-item">
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
          <div class="search-item">
            <div class="label" style="width: 80px;">年龄段</div>
            <el-select
              v-model="search.age"
              placeholder="请选择"
              class="input-area"
              multiple
            >
              <el-option
                v-for="item in agesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">戴眼镜</div>
            <el-select
              v-model="search.glass"
              placeholder="请选择"
              class="input-area"
            >
              <el-option
                v-for="item in glassList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
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
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.personName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === 1">男</span>
          <span v-else-if="scope.row.gender === 2">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄段">
        <template slot-scope="scope">
          <span v-if="scope.row.ageGroup === 'OLD'">老年</span>
          <span v-else-if="scope.row.ageGroup === 'MIDDLEAGED'">中老年</span>
          <span v-else-if="scope.row.ageGroup === 'MIDDLE'">中年</span>
          <span v-else-if="scope.row.ageGroup === 'PRIME'">壮年</span>
          <span v-else-if="scope.row.ageGroup === 'YOUNG'">青年</span>
          <span v-else-if="scope.row.ageGroup === 'TEENAGER'">青少年</span>
          <span v-else-if="scope.row.ageGroup === 'CHILD'">少年</span>
          <span v-else-if="scope.row.ageGroup === 'KID'">儿童</span>
          <span v-else-if="scope.row.ageGroup === 'INFANT'">婴幼儿</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分组名称">
        <template slot-scope="scope">
          {{ scope.row.faceGroupName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件类型">
        <template slot-scope="scope">
          <span v-if="scope.row.idType === 111">身份证</span>
          <span v-else-if="scope.row.idType === 131">工作证</span>
          <span v-else-if="scope.row.idType === 335">驾驶证</span>
          <span v-else-if="scope.row.idType === 113">户口本</span>
          <span v-else-if="scope.row.idType === 133">学生证</span>
          <span v-else>其它</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号码">
        <template slot-scope="scope">
          {{ scope.row.idNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="相似度(%)">
        <template slot-scope="scope">
          {{ scope.row.similary }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="戴眼镜">
        <template slot-scope="scope">
          <span v-if="scope.row.glass === 'YES'">是</span>
          <span v-else-if="scope.row.gender === 'NO'">否</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="抓怕时间">
        <template slot-scope="scope">
          {{
            scope.row.captureTime
              ? scope.row.captureTime.substring(0, 10) +
                " " +
                scope.row.captureTime.substring(11, 19)
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="抓拍图片" width="80">
        <template slot-scope="scope">
          <div class="mini-img">
            <el-image
              style="width: 100%; height: 100%"
              :src="scope.row.captureUrl"
              :preview-src-list="[scope.row.captureUrl]"
            />
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="事件详情" width="150">
        <template slot-scope="scope">
          <i
            title="事件详情"
            class="el-icon-tickets"
            @click="handleDetail(scope.row)"
          />
        </template>
      </el-table-column> -->
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
import { queryVmsTrees, queryImportantEvent } from "@/api/alarmList";
import moment from "moment";
export default {
  components: { Treeselect },
  data() {
    return {
      sexList: [
        {
          value: null,
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
          value: "UNKNOWN",
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
          label: "其它"
        }
      ],
      agesList: [
        {
          value: "OLD",
          label: "老年"
        },
        {
          value: "MIDDLEAGED",
          label: "中老年"
        },
        {
          value: "MIDDLE",
          label: "中年"
        },
        {
          value: "PRIME",
          label: "壮年"
        },
        {
          value: "YOUNG",
          label: "青年"
        },
        {
          value: "TEENAGER",
          label: "青少年"
        },
        {
          value: "CHILD",
          label: "少年"
        },
        {
          value: "KID",
          label: "儿童"
        },
        {
          value: "INFANT",
          label: "婴幼儿"
        },
        {
          value: "UNKNOWN",
          label: "未知"
        }
      ],
      glassList: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "YES",
          label: "是"
        },
        {
          value: "NO",
          label: "否"
        },
        {
          value: "UNKNOWN",
          label: "未知"
        }
      ],
      search: {
        startTime: "",
        endTime: "",
        personName: "",
        gender: null,
        similary: 50,
        idType: 111,
        idNo: "",
        age: [],
        glass: null,
        orderBy: 0
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
        if (node.children == null) {
          delete node.children;
        }
        return {
          id: node.regionIndexCode,
          label: node.name,
          children: node.children
        };
      }
    };
  },
  computed: {},
  watch: {
    value: function(val) {
      // console.log(val);
    }
  },
  created() {
    this.initTree();
    this.getList();
  },
  methods: {
    initTree() {
      queryVmsTrees().then(res => {
        if (res.code === "0") {
          if (res.data.treeDataList) {
            this.treeData = res.data.treeDataList;
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
        cameraregionIndexCodeList: this.value,
        ...this.search
      };
      const res = await queryImportantEvent(params);
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
      this.search.startTime = "";
      this.search.endTime = "";
      this.search.personName = "";
      this.search.gender = null;
      this.search.similary = 50;
      this.search.idType = 111;
      this.search.idNo = "";
      this.search.age = [];
      this.search.glass = null;
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
  // 相似度
  .similay {
    .el-input-number--small {
      width: 80px;
      .el-input-number__decrease {
        display: none;
      }
    }
    .el-input-number--small .el-input-number__increase,
    .el-input-number--small .el-input-number__decrease {
      display: none;
    }
    .el-input-number--small .el-input__inner {
      padding-left: 0px;
      padding-right: 0px;
    }
    .el-slider__runway.show-input {
      margin-right: 90px;
    }
  }
}
</style>
