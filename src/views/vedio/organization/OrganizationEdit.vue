<template>
  <div class="page-popover">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item v-if="nodeData.type === 'add'">
        <span>上级组织: </span><span>{{ nodeData.label }}</span>
      </el-form-item>
      <el-form-item prop="name">
        <el-tooltip class="item" effect="light" content="1~16 位字符；不含 ' / \ : * ?  < > | 这些特殊字符" placement="top">
          <el-input placeholder="组织名称" v-model="ruleForm.name" :maxlength="num16"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="indexCode">
        <el-tooltip class="item" effect="light" content="小于等于32个字符,只允许数字和字母" placement="top">
          <el-input placeholder="组织编号" v-model="ruleForm.indexCode" :maxlength="num32"></el-input>
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
export default {
  name: 'organizationEdit',
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
          this.ruleForm.name = value.label
          this.ruleForm.indexCode = value.id
        }
      },
      deep: true
    }
  },
  mounted () {
    console.log(this.nodeData)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('closePoper', this.nodeData.type)
        } else {
          this.$refs[formName].resetFields();
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss">
.page-popover {
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px!important;
  }
}
</style>
