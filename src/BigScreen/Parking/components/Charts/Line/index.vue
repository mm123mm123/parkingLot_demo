<template>
  <div :key="'chart' + _uid" ref="chart" class="echarts"></div>
</template>

<script>
export default {
  props: {
    color: { // 默认颜色
      type: Array,
      default: () => ['#C83526', '#52AAE9', '#F6920F']
    },
    lineColor: { // x、y轴线颜色
      type: String,
      default: '#04BBFF'
    },
    tooltipUnit: { // tip名称单位
      type: String,
      default: ''
    },
    xAxisData: { // x轴数据
      type: Array,
      default: () => []
    },
    smooth: { // 是否曲线
      type: Boolean,
      default: true
    },
    xAxisType: {
      type: String,
      default: 'category'
    },
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(this.$refs.chart)
      let option = {
        color: this.color,
        textStyle: {
          color: '#fff'
        },
        legend: {
          show: true,
          right: '5%',
          itemWidth: 25,
          itemHeight: 14,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '4%',
          right: '4%',
          top: '10%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.lineColor
            }
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.lineColor
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => {
            if (!params.length) return ''
            let name = params[0].name + this.tooltipUnit
            let data = params.map(x => {
              return `${x.marker} ${x.seriesName}: ${x.value}`
            }).join('<br/>')
            return `<div style="padding: 4px 0; text-align: center;">${name}</div>${data}`
          }
        }
      }
      this.chart.setOption(option)
    },
    setData (data) {
      let series = data.map(x => {
        return {
          name: x.name,
          data: x.data,
          type: 'line',
          smooth: this.smooth,
        }
      })
      let option = this.chart.getOption()
      option.series = series
      this.chart.setOption(option)
    }
  },
  created () {
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    this.chart && this.chart.dispose() // 销毁
  }
}
</script>
<style scoped lang="less">
.echarts {
  width: 100%;
  height: 100%;
}
</style>
