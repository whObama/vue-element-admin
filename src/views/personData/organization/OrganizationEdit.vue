<template>
  <div class="page-popover">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item v-if="nodeData.type === 'add'">
        <span>上级组织: </span><span>{{ nodeData.name }}</span>
      </el-form-item>
      <el-form-item prop="name">
        <el-tooltip class="item" effect="light" content="1~16 位字符；不含 ' / \ : * ?  < > | 这些特殊字符" placement="top">
          <el-input v-model="ruleForm.name" :autofocus="true" placeholder="组织名称" :maxlength="num16" />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="nodeData.type !== 'add'" prop="indexCode">
        <el-tooltip class="item" effect="light" content="小于等于32个字符,只允许数字和字母" placement="top">
          <el-input v-model="ruleForm.indexCode" disabled placeholder="组织编号" :maxlength="num32" />
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button style="float: right;" type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { name, indexCode } from '@/utils/regExp'
import { addOrg, modifyOrg } from '@/api/person'
export default {
  name: 'OrganizationEdit',
  props: {
    nodeData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      ruleForm: {
        name: '',
        indexCode: ''
      },
      rules: {
        name: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        indexCode: [
          { required: true, validator: indexCode, trigger: 'blur' }
        ]
      },
      num16: 16,
      num32: 32
    }
  },
  watch: {
    nodeData: {
      handler: function (value) {
        if (value.type === 'add') {
          this.ruleForm.name = ''
          this.ruleForm.indexCode = ''
        } else {
          this.ruleForm.name = value.name
          this.ruleForm.indexCode = value.orgIndexCode
        }
      },
      deep: true
    }
  },
  mounted () {
    // console.log(this.nodeData)
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.nodeData.type === 'add') {
            const params = {
              name: this.ruleForm.name,
              parentIndexCode: this.nodeData.orgIndexCode
            }
            console.log(params)
            addOrg(params).then(
              res => {
                if (res.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                  this.$emit('closePoper', this.nodeData.type)
                }
              }
            )
          } else {
            const params = {
              ...this.ruleForm
            }
            modifyOrg(params).then(
              res => {
                if (res.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                  this.$emit('closePoper', this.nodeData.type)
                }
              }
            )
          }
        } else {
          // this.$refs[formName].resetFields()
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.page-popover {
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
