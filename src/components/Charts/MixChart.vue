<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
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
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + '月')
        }
        return data
      }())
      this.chart.setOption({
        // backgroundColor: '#344b58',
        backgroundColor: '#fff',
        // title: {
        //   text: '信息展示',
        //   x: '20',
        //   top: '20',
        //   textStyle: {
        //     // color: '#fff',
        //     color: '#333',
        //     fontSize: '22'
        //   },
        //   subtextStyle: {
        //     color: '#90979c',
        //     fontSize: '16'
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
            // textStyle: {
            //   color: '#fff'
            // }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '78.5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          // data: ['人员信息', '人员报警信息', '总和']
          data: ['人员信息', '人员告警信息' ]
        },
        // calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          // axisTick: {
          //   show: false
          // },
          // splitArea: {
          //   show: false
          // },
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: variables.textColor3
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#90979c'
            }
          },
          // axisTick: {
          //   show: false
          // },
          axisLabel: {
            // interval: 0
          },
          // splitArea: {
          //   show: false
          // }
        }],
        // dataZoom: [{
        //   show: false,
        //   height: 0,
        //   xAxisIndex: [
        //     0
        //   ],
        //   bottom: 30,
        //   start: 10,
        //   end: 80,
        //   handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        //   handleSize: '110%',
        //   handleStyle: {
        //     color: '#d3dee5'

        //   },
        //   textStyle: {
        //     color: '#90979c' },
        //   borderColor: '#90979c'

        // }, {
        //   type: 'inside',
        //   show: true,
        //   height: 15,
        //   start: 1,
        //   end: 35
        // }],
        series: [{
          name: '人员信息',
          type: 'bar',
          // stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              },
              barBorderRadius: [8, 8, 0, 0]
            }
          },
          data: [
            709,
            1917,
            2455,
            2610,
            1719,
            1433,
            1544,
            3285,
            5208,
            3372,
            2484,
            4078
          ]
        },
        {
          name: '人员告警信息',
          type: 'bar',
          // stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              },
              barBorderRadius: [8, 8, 0, 0]
            }
          },
          data: [
            327,
            1776,
            507,
            1200,
            800,
            482,
            204,
            1390,
            1001,
            951,
            381,
            220
          ]
        }, 
        // {
        //   name: '总和',
        //   type: 'line',
        //   stack: 'total',
        //   symbolSize: 10,
        //   symbol: 'circle',
        //   itemStyle: {
        //     normal: {
        //       color: 'rgba(252,230,48,1)',
        //       barBorderRadius: 0,
        //       label: {
        //         show: true,
        //         position: 'top',
        //         formatter(p) {
        //           return p.value > 0 ? p.value : ''
        //         }
        //       }
        //     }
        //   },
        //   data: [
        //     1036,
        //     3693,
        //     2962,
        //     3810,
        //     2519,
        //     1915,
        //     1748,
        //     4675,
        //     6209,
        //     4323,
        //     2865,
        //     4298
        //   ]
        // }
        ]
      })
    }
  }
}
</script>
