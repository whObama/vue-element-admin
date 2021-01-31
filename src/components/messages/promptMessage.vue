<template>
<!-- 处理element表格表头文字提示特别添加全局注册组件 -->
<div class="promt-message-tooltip">
 <el-tooltip effect="light" placement="top">
  <div slot="content">
   <p v-for="item in messages" :key="item">
    {{item}}
   </p>
  </div>
  <i class="el-icon-question tips-icon"></i>
 </el-tooltip>
</div>
</template>
<script>
export default {
 props: ['messages']
}
</script>
<style lang="scss">
.promt-message-tooltip {
 .tips-icon {
 color:#409eff;
 margin-left:5px;
 font-size:14px;
 }
}
</style>
