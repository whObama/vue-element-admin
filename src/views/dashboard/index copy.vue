<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="time-search">
      <el-date-picker
        v-model="selectTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="handleChange"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
    <div class="page-data-toolbar">
      <el-radio-group v-model="dataType" size="medium">
        <!-- <el-radio-button label="信息展示" ></el-radio-button>
        <el-radio-button label="人员信息"></el-radio-button>
        <el-radio-button label="人员告警信息"></el-radio-button> -->
        <el-radio-button
                v-for="item in allDataType"
                :key="item.value"
                :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
    </div>
    <mix-chart v-if="dataType == 1"  width="100%" style="height: calc(100% - 0px)" />
    <person-chart v-else-if="dataType == 2" width="100%" style="height: calc(100% - 76px)" />
    <alert-person-chart v-else width="100%" style="height: calc(100% - 76px)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import MixChart from '@/components/Charts/MixChart'
import PersonChart from '@/components/Charts/PersonChart'
import moment from 'moment'
var pickerMinDate = null,
    pickerMaxDate = null,
    day31 = 30 * 24 * 3600 * 1000
export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, MixChart, PersonChart, AlertPersonChart },
  data() {
    return {
      // currentRole: 'adminDashboard'
      selectTime: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate && pickerMinDate) {
            pickerMinDate = null;
          } else if (minDate) {
            pickerMinDate = minDate.getTime();
          }
        },
        disabledDate (time) {
          if (pickerMinDate) {
           return (time.getTime() > (pickerMinDate + day31)) || (time.getTime() < (pickerMinDate - day31));
         }
          return time.getTime() > Date.now()
        }
      },
      dataType: 1,
      allDataType: [
        { value: 1, label: '信息展示' },
        { value: 2, label: '人员信息' },
        { value: 3, label: '人员告警信息' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  methods: {
    handleChange () {
      console.log(this.selectTime)
    }
  }
  // created() {
  //   if (!this.roles.includes('admin')) {
  //     this.currentRole = 'editorDashboard'
  //   }
  // }
}
</script>
<style lang="scss" scoped>
  .dashboard-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 140px);
    .time-search {
      padding: 20px;
    }
    .page-data-toolbar {
      position: absolute;
      top: 0;
      right: 20px;
      margin-top: 20px;
      z-index: 1000;
    }
  }
</style>
