<template>
  <div class="app-container">
    <div class="search-box">
      <el-row>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">用户名</div>
            <el-input
              class="input-area"
              placeholder="请输入用户名"
              v-model="search.userName"
              clearable>
            </el-input>
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
        <el-col :span="20">
          <div class="button-content">
            <div class="button-box">
              <el-button type="primary" @click="searchSubmit">确定查询</el-button>
              <el-button type="warning" @click="resetSearch">取消查询</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      
    </div>
    <el-button class="top-button" type="primary" @click="handleAdd">添加用户</el-button>
    <el-button class="top-button" type="danger" :disabled="removeDisabled" @click="removeMore">批量删除用户</el-button>

    <el-table
      :data="list"
      style="width: 100%;"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="用户编码">
        <template slot-scope="scope">
          {{ scope.row.userCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.roleCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          {{ scope.row.creator }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime ? scope.row.createTime.substring(0, 10) + ' ' +scope.row.createTime.substring(11, 19) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.modifyTime ? scope.row.modifyTime.substring(0, 10) + ' ' +scope.row.modifyTime.substring(11, 19) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
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
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="width: 100%;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog width="30%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改用户':'添加用户'">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-tooltip class="item" effect="light" content="1~32 位字符；不含 ' / \ : * ?  < > | 这些特殊字符" placement="top">
            <el-input  v-model="form.userName" placeholder="用户名" :maxlength="num32" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="用户编码" prop="userCode">
          <el-tooltip class="item" effect="light" content="小于等于32个字符,只允许数字和字母" placement="top">
            <el-input :disabled="inputDisabled" v-model="form.userCode" placeholder="用户编码" :maxlength="num32" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="用户密码" prop="userPwd">
          <el-tooltip class="item" effect="light" content="小于等于32个字符,只允许数字和字母" placement="top">
            <el-input v-model="form.userPwd" placeholder="用户密码" :maxlength="num32" show-password />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleCode">
         <el-select style="width: 100%;" v-model="form.roleCode" placeholder="请选择" class="input-area">
            <el-option
              v-for="item in rolesList"
              :key="item.roleCode"
              :label="item.roleName"
              :value="item.roleCode">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上传图片" prop="faceUrl">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :http-request="UploadFile"
            :before-upload="beforeUpload">
            <img v-if="form.faceUrl" :src="form.faceUrl" class="avatar">
            <i v-if="form.faceUrl" class="el-icon-delete upload-delete" @click.stop="removeUpload(form.faceUrl)"></i>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            :autosize="{ minRows: 2, maxRows: 4}"
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
import { queryInfoList, deleteInfo, updateInfo, uploadFile } from '@/api/info'
import { getRoles } from '@/api/role'
import { name, valueRequired, indexCode, notRequiredCode, phone } from '@/utils/regExp'

export default {
  data() {
    return {
      rolesList: [],
      search: {
        userName: '',
        // roleCode: ''
      },
      removeDisabled: true,
      form: {
        userName: '',
        roleCode: '',
        userCode: '',
        userPwd: '',
        // faceUrl: '',
        description: ''
      },
      rules: {
        userName: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        userCode: [
          { required: true, validator: indexCode, trigger: 'blur' }
        ],
        userPwd: [
          { required: true, validator: indexCode, trigger: 'blur' }
        ],
        roleCode: [
          { required: true, validator: valueRequired, trigger: 'blur' }
        ]
      },
      action: '',
      num32: 32,
      list: [],
      dialogVisible: false,
      dialogType: 'new',
      inputDisabled: false,
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      multipleSelectData: []
    }
  },
  computed: {
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    async getRoles() {
      let params = {
        pageNo: 1,
        pageSize: 100,
      }
      const res = await getRoles(params)
      this.rolesList = res.data.list
    },
    async getList() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.search
      }
      const res = await queryInfoList(params)
      this.list = res.data.list
      this.total = res.data.total
    },
    searchSubmit () {
      this.getList()
    },
    resetSearch () {
      this.search.userName = ''
      this.search.roleCode = ''
      this.getList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.form.userName = ''
      this.form.userCode = ''
      this.form.userId = null
      this.form.userPwd = ''
      this.form.roleCode = ''
      // this.form.faceUrl = ''
      this.form.description = ''
      this.inputDisabled = false
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.form.userName = scope.row.userName
      this.form.userCode = scope.row.userCode
      this.form.userId = scope.row.userId
      this.form.userPwd = scope.row.userPwd
      this.form.roleCode = scope.row.roleCode
      // this.form.faceUrl = scope.row.faceUrl
      this.form.description = scope.row.description
      this.inputDisabled = true
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateInfo(this.form).then(
                res => {
                  if (res.code === '0') {
                    this.$message({
                      type: 'success',
                      message: '保存成功'
                    })
                    this.dialogVisible = false
                    this.getList()
                  }
                }
              ).catch(
                err => {
                  console.log(err)
                }
              )
          } else {
            // this.$refs[formName].resetFields()
            return false
          }
        });
      },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除' + row.userName + '吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = []
          params.push(row.userId)
          deleteInfo({ userIds: params }).then(result => {
            if (result.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          }).catch(
            err => {
              console.log(err)
            }
          )
        }).catch(() => {
        })
    },
    handleSelectionChange(val) {
      this.multipleSelectData = val
      if (this.multipleSelectData.length > 0) {
        this.removeDisabled = false
      } else {
        this.removeDisabled = true
      }
    },
    removeMore() {
      let params = []
      this.multipleSelectData.forEach(item => {
        params.push(item.userId)
      })
      this.$confirm('确认从用户列表中删除' + this.multipleSelectData.length + '个用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteInfo({ userIds: params }).then(result => {
            if (result.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(
          err => {
            console.log('获取请求失败' + err)
          }
        )
    }
  },
}
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
    background: rgba(0,0,0,0.04);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
