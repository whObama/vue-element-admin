<template>
  <div class="app-container">
    <div class="search-box">
      <el-row>
        <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">角色名称:</div>
            <el-input
              class="input-area"
              placeholder="请输入角色名称"
              v-model="search.roleName"
              clearable>
            </el-input>
          </div>
        </el-col>
        <!-- <el-col :span="4">
          <div class="search-item">
            <div class="label" style="width: 80px;">角色编号</div>
            <el-input
              class="input-area"
              placeholder="请输入角色编号"
              v-model="search.roleCode"
              clearable>
            </el-input>
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
      <!-- <div class="button-content">
        <div class="button-box">
          <el-button type="primary" @click="searchSubmit">确定查询</el-button>
          <el-button type="grey" plain @click="resetSearch">取消查询</el-button>
        </div>
      </div> -->
    </div>
    <el-button class="add-button" type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table :data="rolesList" style="width: 100%;" border v-loading="loading">
      <el-table-column align="center" label="角色编码">
        <template slot-scope="scope">
          {{ scope.row.roleCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
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
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleMenu(scope)">关联菜单</el-button>
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

    <el-dialog width="30%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改角色':'添加角色'">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-tooltip class="item" effect="light" content="1~32 位字符；不含 ' / \ : * ?  < > | 这些特殊字符" placement="top">
            <el-input v-model="form.roleName" placeholder="角色名称" :maxlength="num32" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-tooltip class="item" effect="light" content="小于等于32个字符,只允许数字和字母" placement="top">
            <el-input :disabled="inputDisabled" v-model="form.roleCode" placeholder="角色编码" :maxlength="num32" />
          </el-tooltip>
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
    <!-- 关联菜单 -->
    <el-dialog width="30%" :visible.sync="menuVisible" title="关联菜单">
      <el-form :model="menuform" :rules="menuRules" ref="menuform" label-width="80px" label-position="left" class="demo-ruleForm">
        <el-form-item label="菜单权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            node-key="resourceCode"
            :default-expanded-keys="expandedNodes"
            show-checkbox
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="submitTree('menuform')">保存</el-button>
        <el-button type="danger" @click="resetTree('menuform')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRole, deleteRole, updateRole, getMenuTree, updateMenuTree } from '@/api/role'
import { name, indexCode } from '@/utils/regExp'

export default {
  data() {
    return {
      loading: false,
      search: {
        roleName: ''
      },
      form: {
        roleName: '',
        roleCode: '',
        description: ''
      },
      rules: {
        roleName: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        roleCode: [
          { required: true, validator: indexCode, trigger: 'blur' }
        ],
      },
      num32: 32,
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      inputDisabled: false,
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      menuVisible: false,
      menuform: {
        roleCode: '',
        resourceCode: ''
      },
      menuRules: {},
      routesData: [],
      defaultProps: {
        children: 'childs',
        label: 'resourceName'
      },
      checkStrictly: false,
      expandedNodes: []
    }
  },
  computed: {
  },
  created() {
    this.getRoles()
    this.initMenuTree()
  },
  methods: {
    // 获取菜单树
    initMenuTree (roleCode) {
      let params = {
        roleCode
      }
      getMenuTree(params).then(
        res => {
          if(res.code === '0') {
            this.routesData = res.data
          }
        }
      ).catch(
        err => {
          console.log('获取请求失败' + err)
        }
      )
    },
    async getRoles() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.search
      }
      const res = await getRoles(params)
      this.rolesList = res.data.list
      this.total = res.data.total
    },
    searchSubmit () {
      this.getRoles()
    },
    resetSearch () {
      this.search.roleName = ''
      this.getRoles()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getRoles()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getRoles()
    },
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.form.roleName = ''
      this.form.roleCode = ''
      this.form.description = ''
      this.form.roleId = null
      this.inputDisabled = false
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.form.roleName = scope.row.roleName
      this.form.roleCode = scope.row.roleCode
      this.form.description = scope.row.description
      this.form.roleId = scope.row.roleId
      this.inputDisabled = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateRole(this.form).then(
            res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.dialogVisible = false
                this.getRoles()
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
      this.$confirm('确定删除' + row.roleName + '角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = []
          params.push({ roleId: row.roleId, roleCode: row.roleCode })
          deleteRole(params).then(result => {
            if (result.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getRoles()
            }
          }).catch(
            err => {
              console.log(err)
            }
          )
        }).catch(() => {
        })
    },
    handleMenu (scope) {
      this.checkedNodes = []
      this.expandedNodes = []
      this.menuVisible = true
      this.menuform.roleCode = scope.row.roleCode
      let that = this
      getMenuTree({ roleCode: scope.row.roleCode}).then(
        res => {
          if(res.code === '0') {
            let roleMenuList = res.data || []
            roleMenuList.forEach(item => {
              if (item.rolePriveStatus === 'Y') {
                this.expandedNodes.push(item.resourceCode)
                that.$nextTick(()=> {
                  that.$refs.tree.setChecked(item.resourceCode, true)
                })
              } else {
                that.$nextTick(()=> {
                  that.$refs.tree.setChecked(item.resourceCode, false)
                })
              }
              if (item.childs.length > 0) {
                item.childs.forEach(citem => {
                  if (citem.rolePriveStatus === 'Y') {
                    that.$nextTick(()=> {
                      that.$refs.tree.setChecked(citem.resourceCode, true)
                    })
                    this.expandedNodes.push(item.resourceCode)
                  } else {
                    that.$nextTick(()=> {
                      that.$refs.tree.setChecked(citem.resourceCode, false)
                    })
                  }
                })
              }
            })
            console.log(this.expandedNodes)
          }
        }
      ).catch(
        err => {
          console.log('获取请求失败' + err)
        }
      )
    },
    submitTree (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let selectIds = this.$refs.tree.getCheckedNodes()
          // let selectResourceCodes = selectIds.map(item => {
          //   return item.resourceCode
          // })
          let selectResourceCodes = []
          if (selectIds.length > 0) {
            selectIds.forEach(item => {
              if (item.resourceCode && item.parentResourceCode) {
                selectResourceCodes.push(item.parentResourceCode)
              }
              selectResourceCodes.push(item.resourceCode)
            })
          }
          let params = {
            roleCode: this.menuform.roleCode,
            resourceCodes: selectResourceCodes
          }
          console.log(params)
          updateMenuTree(params).then(
            res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.menuVisible = false
                this.getRoles()
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
    resetTree(formName) {
      this.$refs[formName].resetFields()
      this.menuVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 845px;
  .add-button {
    margin: 15px 0;
  }
}
</style>
