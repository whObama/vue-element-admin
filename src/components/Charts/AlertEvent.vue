<template>
  <div :id="id" :class="className" :style="{height:height,width:width}">
    <el-table :data="alartTable" style="width: 100%" class="alert-table" :show-header="true"
      :header-cell-style="{ backgroundColor: 'rgba(0,0,0,0.05)'}" @row-click="hanleCell">
      <!-- <el-table-column width="30" align="center">
        <template slot-scope="scope">
          <div :class="{ 'dot': scope.row.status }"></div>
        </template>
      </el-table-column> -->
      <el-table-column prop="eventName" label="事件类型" align="center">
      </el-table-column>
      <el-table-column prop="eventRuleName" label="规则类型" align="center">
      </el-table-column>
      <el-table-column prop="happenTime" label="发生时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.happenTime ? scope.row.happenTime.substring(0, 10) + ' ' +scope.row.happenTime.substring(11, 19) : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="srcName" label="事件源" align="center">
      </el-table-column>
      <!-- <el-table-column label="事件详情" align="center">
        <template slot-scope="scope">
          <i title="事件详情" class="el-icon-tickets" @click="handleDetail(scope.row)"></i>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: 'alertEvent'
    },
    id: {
      type: String,
      default: 'alertEvent'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    alartTable: {
      type: Array
    },
    alarmListRouter: {
      type: String
    }
  },
  data () {
    return {
      // tableData: alartTable
    }
  },
  methods: {
    hanleCell () {
      this.$router.push(this.alarmListRouter)
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.alertEvent {
  .alert-table {
    // border: 1px solid #{$textColor1};
  }
  .dot {
    background: #fa3239;
    border-radius: 4px;
    height: 8px;
    width: 8px;
  }
}
</style>
