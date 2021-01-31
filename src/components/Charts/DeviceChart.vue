<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" @click="$router.push(deviceRouter)"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import variables from '@/styles/variables.scss'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    deviceData: {
      type: Object
    },
    deviceRouter: {
      type: String
    }
  },
  data () {
    return {
      chart: null,
      deviceOnline: 0,
      deviceUnline: 0
    }
  },
  watch: {
    deviceData: {
      handler: function (val) {
        this.deviceOnline = val.online
        this.deviceUnline = val.total - val.online
        this.initChart()
      },
      deep: true
    }
  },
  mounted () {
    // this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        // backgroundColor: '#344b58',
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          // top: "center",
          top: '8%',
          right: "5%",
          data: ['设备在线数', '设备离线数'],
          textStyle: {
            color: variables.textColor5,
            fontSize: 14
          },
        },
        series: [{
          name: '设备数量',
          type: 'pie',
          radius: ['25%', '40%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            show: true,
            normal: {
              position: 'outside',
              fontSize: 14
            }
          },
          labelLine: {
            length: 1,
            length2: 20,
            smooth: true
          },
          data: [
            {
              value: this.deviceOnline,
              name: '设备在线数',
              itemStyle: {
                color: "rgba(45,131,232,1)",
                borderColor: "rgba(45,131,232,1)",
                borderWidth: 3
              }
            },
            {
              value: this.deviceUnline,
              name: '设备离线数',
              itemStyle: {
                color: "rgba(211,121,0,1)",
                borderColor: "rgba(211,121,0,1)",
                borderWidth: 3
              }
            }
          ]
        }]
      })
    }
  }
}
</script>
