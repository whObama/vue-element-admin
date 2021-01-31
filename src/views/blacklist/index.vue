<template>
  <div class="app-container">
    <div class="search-box">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">姓名</div>
            <el-input
              v-model="search.name"
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
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">证件类型</div>
            <el-select
              v-model="search.certType"
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
              v-model="search.certNo"
              class="input-area"
              placeholder="请输入证件号码"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-item" style="margin-right: 0px;">
            <div class="label" style="width: 80px;">工号</div>
            <el-input
              v-model="search.jobNo"
              class="input-area"
              placeholder="请输入工号"
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

      <!-- <div class="button-content">
        <div class="button-box">
          <el-button type="primary" @click="searchSubmit">确定查询</el-button>
          <el-button type="grey" plain @click="resetSearch">取消查询</el-button>
        </div>
      </div> -->
    </div>
    <el-button class="top-button" type="primary" @click="handleAdd"
      >添加人员</el-button
    >
    <el-button
      class="top-button"
      type="danger"
      :disabled="removeDisabled"
      @click="removeMore"
      >批量删除人员</el-button
    >
    <el-button class="top-button" type="grey" icon="el-icon-upload2"
      >导入</el-button
    >
    <el-button
      class="top-button"
      type="grey"
      :disabled="removeDisabled"
      icon="el-icon-download"
      >导出</el-button
    >

    <el-table
      :data="list"
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
      <!-- <el-table-column align="header-center" label="所属组织">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column> -->
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
            <!-- <img :src="scope.row.faceUrl" alt="" @click="preview('single', scope.row.faceUrl)"/> -->
            <el-image
              style="width: 100%; height: 100%"
              :src="scope.row.faceUrl"
              :preview-src-list="[scope.row.faceUrl]"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)"
            >修改</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope)"
            >删除</el-button
          >
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
      width="30%"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改人员' : '添加人员'"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-tooltip
            class="item"
            effect="light"
            content="1~32 位字符；不含 ' / \ : * ?  < > | 这些特殊字符"
            placement="top"
          >
            <el-input
              v-model="form.name"
              placeholder="姓名"
              :maxlength="num32"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="form.gender"
            style="width: 100%;"
            placeholder="请选择"
            class="input-area"
          >
            <el-option
              v-for="item in formSexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="证件类型" prop="certType">
          <el-select
            v-model="form.certType"
            style="width: 100%;"
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
        </el-form-item>
        <el-form-item label="证件号码" prop="certNo">
          <el-tooltip
            class="item"
            effect="light"
            content="小于等于32个字符,只允许数字和字母"
            placement="top"
          >
            <el-input
              v-model="form.certNo"
              placeholder="证件号码"
              :maxlength="num32"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="工号" prop="jobNo">
          <el-tooltip
            class="item"
            effect="light"
            content="小于等于32个字符,只允许数字和字母"
            placement="top"
          >
            <el-input
              v-model="form.jobNo"
              placeholder="工号"
              :maxlength="num32"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-tooltip
            class="item"
            effect="light"
            content="1-11位数字"
            placement="top"
          >
            <el-input
              v-model="form.phone"
              placeholder="手机号码"
              :maxlength="num11"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="上传图片" prop="faceUrl">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :http-request="UploadFile"
            :before-upload="beforeUpload"
          >
            <img v-if="form.faceUrl" :src="form.faceUrl" class="avatar" />
            <i
              v-if="form.faceUrl"
              class="el-icon-delete upload-delete"
              @click.stop="removeUpload(form.faceUrl, form.indexCode)"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button type="danger" @click="resetForm('form')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPersonList,
  addPerson,
  deletePerson,
  updatePerson,
  uploadFile,
  removeFile
} from "@/api/person";
import {
  name,
  valueRequired,
  indexCode,
  notRequiredCode,
  phone
} from "@/utils/regExp";

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
        name: "",
        gender: 3,
        certType: 111,
        // phone: '',
        certNo: "",
        jobNo: ""
      },
      removeDisabled: true,
      form: {
        name: "",
        gender: 1,
        certType: 111,
        certNo: "",
        phone: "",
        jobNo: "",
        faceUrl: "",
        description: "",
        indexCode: ""
      },
      rules: {
        name: [{ required: true, validator: name, trigger: "blur" }],
        gender: [{ required: true, validator: valueRequired, trigger: "blur" }],
        certType: [
          { required: true, validator: valueRequired, trigger: "blur" }
        ],
        certNo: [{ required: true, validator: indexCode, trigger: "blur" }],
        jobNo: [
          { required: false, validator: notRequiredCode, trigger: "blur" }
        ],
        phone: [{ required: false, validator: phone, trigger: "blur" }]
      },
      action: "",
      num32: 32,
      num11: 11,
      list: [],
      dialogVisible: false,
      dialogType: "new",
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      multipleSelectData: []
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.search
      };
      const res = await queryPersonList(params);
      this.list = res.data.list;
      this.total = res.data.total;
    },
    searchSubmit() {
      this.getList();
    },
    resetSearch() {
      this.search.name = "";
      this.search.gender = 3;
      this.search.certType = 111;
      this.search.certNo = "";
      this.search.jobNo = "";
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
    handleAdd() {
      this.dialogType = "new";
      this.dialogVisible = true;
      this.form.name = "";
      this.form.gender = 1;
      this.form.certType = 111;
      this.form.certNo = "";
      this.form.phone = "";
      this.form.jobNo = "";
      this.form.faceUrl = "";
      this.form.description = "";
      this.form.indexCode = "";
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.form.name = scope.row.name;
      this.form.gender = scope.row.gender;
      this.form.certType = scope.row.certType;
      this.form.certNo = scope.row.certNo;
      this.form.phone = scope.row.phone;
      this.form.jobNo = scope.row.jobNo;
      this.form.faceUrl = scope.row.faceUrl;
      this.form.description = scope.row.description;
      this.form.indexCode = scope.row.indexCode;
    },
    // 校验上传文件
    beforeUpload(file, fileList) {
      const isRightType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isRightSize = file.size / 1024 / 1024 <= 10;
      if (
        isRightType !== "jpg" &&
        isRightType !== "png" &&
        isRightType !== "jpeg"
      ) {
        this.$message.error("请选择.jpg、.jpeg、.png格式的图片！");
        return false;
      }
      if (!isRightSize) {
        this.$message.error("上传图片大小不能超过10M!");
        return false;
      }
    },
    // 图片上传
    UploadFile(param) {
      const fd = new FormData();
      fd.append("file", param.file); // 要提交给后台的文件
      uploadFile(fd)
        .then(res => {
          if (res.code === "0" && res.data) {
            this.$message({
              type: "success",
              message: `文件上传成功`
            });
            this.form.faceUrl = res.data;
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: `文件上传失败`
          });
          console.log(err);
          return false;
        });
    },
    // 删除图片
    removeUpload(url, indexcode) {
      console.log(val);
      removeFile({ faceUrl: val, indexCode })
        .then(res => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.form.faceUrl = "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogType === "new") {
            delete this.form.indexCode;
            addPerson(this.form)
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
            updatePerson(this.form)
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
          }
        } else {
          // this.$refs[formName].resetFields()
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    handleDelete({ $index, row }) {
      this.$confirm("确定删除" + row.name + "吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = [];
          params.push(row.indexCode);
          deletePerson({ indexCodes: params })
            .then(result => {
              if (result.code === "0") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getList();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelectData = val;
      if (this.multipleSelectData.length > 0) {
        this.removeDisabled = false;
      } else {
        this.removeDisabled = true;
      }
    },
    removeMore() {
      const params = [];
      this.multipleSelectData.forEach(item => {
        params.push(item.indexCode);
      });
      this.$confirm(
        "确认从人员列表中删除" + this.multipleSelectData.length + "个人员吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deletePerson({ indexCodes: params }).then(result => {
            if (result.code === "0") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            }
          });
        })
        .catch(err => {
          console.log("获取请求失败" + err);
        });
    }
  }
};
</script>

<style lang="scss">
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
}
</style>
