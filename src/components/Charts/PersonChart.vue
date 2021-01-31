<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" @click="$router.push(mianPersonRouter)" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import variables from '@/styles/variables.scss'
import { staticPersonNum } from '@/api/home'

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
    dataType: {
      type: Number,
      default: 0
    },
    mianPersonRouter: {
      type: String
    }
  },
  data () {
    return {
      chart: null,
      dataX: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
      seriesData: [13, 1, 4, 44, 45, 322, 76]
    }
  },
  watch: {
    dataType: {
      handler (newValue, oldValue) {
        console.log(newValue)
        this.initData()
      },
      deep: true
    }
  },
  mounted () {
    // this.initChart()
    this.initData()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initData () {
      staticPersonNum({ type: this.dataType }).then(
        res => {
          if (res.code === '0') {
            if (res.data.length > 0) {
              this.dataX = []
              this.seriesData = []
              res.data.forEach(item => {
                this.dataX.push(item.dateTime)
                this.seriesData.push(item.num)
              })
            } else {
              this.dataX = []
              this.seriesData = []
            }
            this.initChart()
          }
        }
      )
    },
    initChart () {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        // backgroundColor: '#344b58',
        backgroundColor: '#fff',
        title: {
          // text: "人员数量(人)",
          left: "18px",
          top: "10%",
          textStyle: {
            color: variables.textColor5,
            fontSize: 12,
            fontWeight: '400'
          }
        },
        color: ['#73A0FA', '#73DEB3', '#FFB761'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: variables.textColor5
            },
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        grid: {
          left: '25',
          right: '25',
          bottom: '24',
          top: '75',
          containLabel: true
        },
        legend: {
          data: ['人员数量'],
          orient: 'horizontal',
          icon: "rect",
          show: true,
          left: 20,
          top: 10,
          textStyle: {
            color: variables.textColor5,
            fontSize: 12
          }
        },
        // calculable: true,
        xAxis: {
          type: 'category',
          axisLabel: {
            color: variables.textColor5,
            textStyle: {
              fontSize: 12
            },
          },
          data: this.dataX,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          // max: max_value>=100? max_value + 100: max_value+10,
          // max: max_value > 100 ? max_value * 2 : max_value + 10,
          // interval: 10,
          // nameLocation: "center",
          axisLabel: {
            color: variables.textColor5,
            textStyle: {
              fontSize: 12
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: variables.textColor1
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        series: [
          {
            name: '人员数量',
            type: 'line',
            smooth: true,
            data: this.seriesData
          }
        ]
      })
    }
  }
}
</script>
