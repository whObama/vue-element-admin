<template>
  <div class="app-container">
    <div class="search-box">
      <el-row>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">菜单名称</div>
            <el-input
              class="input-area"
              placeholder="请输入菜单名称"
              v-model="search.resourceName"
              clearable>
            </el-input>
          </div>
        </el-col>
         <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">一级菜单</div>
           <el-select v-model="search.parentResourceCode" placeholder="请选择" class="input-area">
              <el-option
                v-for="item in rolesList"
                :key="item.resourceCode"
                :label="item.resourceName"
                :value="item.resourceCode">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="button-content">
            <div class="button-box">
              <el-button type="primary" @click="searchSubmit">确定查询</el-button>
              <el-button type="warning" @click="resetSearch">取消查询</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      
    </div>
    <el-button class="top-button" type="primary" @click="handleAdd">添加菜单</el-button>
    <el-button class="top-button" type="danger" :disabled="removeDisabled" @click="removeMore">批量删除菜单</el-button>

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
      <el-table-column align="center" label="菜单编号">
        <template slot-scope="scope">
          {{ scope.row.resourceCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单名称">
        <template slot-scope="scope">
          {{ scope.row.resourceName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="一级菜单">
        <template slot-scope="scope">
          {{ scope.row.parentResourceCode }}
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
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
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

    <el-dialog width="30%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改菜单':'添加菜单'">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left" class="demo-ruleForm">
        <el-form-item label="菜单名称" prop="resourceName">
          <el-tooltip class="item" effect="light" content="1~32 位字符；不含 ' / \ : * ?  < > | 这些特殊字符" placement="top">
            <el-input v-model="form.resourceName" placeholder="菜单名称" :maxlength="num32" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="菜单编码" prop="resourceCode">
          <el-tooltip class="item" effect="light" content="小于等于32个字符,只允许数字和字母" placement="top">
            <el-input :disabled="inputDisabled" v-model="form.resourceCode" placeholder="菜单编码" :maxlength="num32" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="一级菜单" prop="parentResourceCode">
         <el-select style="width: 100%;" v-model="form.parentResourceCode" placeholder="请选择" class="input-area">
            <el-option
              v-for="item in rolesList"
              :key="item.resourceCode"
              :label="item.resourceName"
              :value="item.resourceCode">
            </el-option>
          </el-select>
        </el-form-item>
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
import { queryMenuList, deleteInfo, updateMenu, getRoles, queryMenuChildList } from '@/api/menuConfig'
import { name, valueRequired, indexCode, notRequiredCode, phone } from '@/utils/regExp'
import childMenuConfig  from './childMenuConfig'
export default {
  data() {
    return {
      rolesList: [],
      search: {
        resourceName: '',
        parentResourceCode: ''
      },
      removeDisabled: true,
      form: {
        resourceName: '',
        resourceCode: '',
        parentResourceCode: '',
        resourceUri: '',
        description: ''
      },
      rules: {
        resourceName: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        resourceCode: [
          { required: true, validator: indexCode, trigger: 'blur' }
        ],
        parentResourceCode: [
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
    // this.list = [
    //   {
    //     resourceName: '张三',
    //     faceUrl: require('../../assets/images/火影.jpg')
    //   },
    //   {
    //     resourceName: '李四',
    //     faceUrl: require('../../assets/images/bg2.png')
    //   }
    // ]
    this.getList()
    this.getRoles()
  },
  methods: {
    async getRoles() {
      let params = {
        pageNo: 1,
        pageSize: 100,
      }
      const res = await queryMenuList(params)
      this.rolesList = res.data.list
    },
    async getList() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.search
      }
      const res = await queryMenuChildList(params)
      this.list = res.data.list
      this.total = res.data.total
    },
    searchSubmit () {
      this.getList()
    },
    resetSearch () {
      this.search.resourceName = ''
      this.search.parentResourceCode = ''
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
      this.form.resourceName = ''
      this.form.resourceCode = ''
      this.form.parentResourceCode = ''
      this.form.resourceUri = ''
      this.form.description = ''
      this.form.resourceId = null
      this.inputDisabled = false
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.form.resourceName = scope.row.resourceName
      this.form.resourceCode = scope.row.resourceCode
      this.form.parentResourceCode = scope.row.parentResourceCode
      this.form.resourceUri = scope.row.resourceUri
      this.form.description = scope.row.description
      this.form.resourceId = scope.row.resourceId
      this.inputDisabled = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          childMenuConfig.map(item => {
            if (item.name === this.form.resourceCode) {
              return this.form.resourceUri = item.component
            }
          })
          updateMenu(this.form).then(
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
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除' + row.resourceName + '吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = []
          params.push(row.resourceCode)
          deleteInfo({ resourceCodes: params }).then(result => {
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
        params.push(item.resourceCode)
      })
      this.$confirm('确认从用户列表中删除' + this.multipleSelectData.length + '个菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteInfo({ resourceCodes: params }).then(result => {
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
}
</style>
