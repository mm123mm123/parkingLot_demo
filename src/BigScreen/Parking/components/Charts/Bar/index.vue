<template>
  <div :key="'chart' + _uid" ref="chart" class="echarts"></div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    lineColor: { // x、y轴线颜色
      type: String,
      default: '#04BBFF'
    },
    showMax: { // 显示最大值
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    setData (data) {
      const CubeLeft = this.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x, shape.y]
          const c1 = [shape.x - 20, shape.y - 4]
          const c2 = [xAxisPoint[0] - 20, xAxisPoint[1] - 4]
          const c3 = [xAxisPoint[0], xAxisPoint[1]]
          ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        }
      })
      const CubeRight = this.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x, shape.y]
          const c2 = [xAxisPoint[0], xAxisPoint[1]]
          const c3 = [xAxisPoint[0] + 8, xAxisPoint[1] - 4]
          const c4 = [shape.x + 8, shape.y - 4]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
      })
      const CubeTop = this.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          // 逆时针 角 y 负数向上  X 负数向左
          const c1 = [shape.x, shape.y]
          const c2 = [shape.x + 8, shape.y - 4]
          const c3 = [shape.x - 11, shape.y - 8]
          const c4 = [shape.x - 20, shape.y - 4]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
      })
      this.$echarts.graphic.registerShape('CubeLeft', CubeLeft)
      this.$echarts.graphic.registerShape('CubeRight', CubeRight)
      this.$echarts.graphic.registerShape('CubeTop', CubeTop)
      let MAX = []
      let VALUE = []
      let xAxisData = []
      let chartData = [].concat(data)
      chartData.forEach(item => {
        VALUE.push(item.value)
        xAxisData.push(item.name)
      })
      let maxItem = Math.max(...VALUE)

      let SUM = 0
      for (let item of VALUE) {
        SUM += item
        MAX.push(maxItem)
      }

      let series = []
      if (this.showMax) {
        series.push({
          type: 'custom',
          renderItem: function (params, api) {
            const location = api.coord([api.value(0), api.value(1)])
            return {
              type: 'group',
              children: [
                {
                  type: 'CubeLeft',
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                  },
                  style: {
                    fill: 'rgba(1,17,33,.5)'
                  }
                },
                {
                  type: 'CubeRight',
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                  },
                  style: {
                    fill: 'rgba(1,17,33,.5)'
                  }
                },
                {
                  type: 'CubeTop',
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                  },
                  style: {
                    fill: 'rgba(1,17,33,.5)'
                  }
                }
              ]
            }
          },
          data: MAX
        })
      }
      series.push({
        type: 'custom',
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)])
          return {
            type: 'group',
            children: [{
              type: 'CubeLeft',
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0])
              },
              style: {
                fill: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#1477BD'
                }, {
                  offset: 1,
                  color: '#00FFFE'
                }])
              }
            }, {
              type: 'CubeRight',
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0])
              },
              style: {
                fill: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#002E75' // 顶部
                }, {
                  offset: 1,
                  color: '#00B0D0' // 底部
                }])
              }
            },
            {
              type: 'CubeTop',
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0])
              },
              style: {
                fill: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#33F7FB'
                }, {
                  offset: 1,
                  color: '#00FFFE'
                }])
              }
            }]
          }
        },
        data: VALUE
      })

      this.chart = this.$echarts.init(this.$refs.chart)
      let option = {
        title: {
          show: true,
          text: this.title,
          textStyle: {
            color: '#44F3FE',
          },
          left: 'center'
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
          data: xAxisData,
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
          },
          boundaryGap: [0.2, 0.2]
        },
        series
      }
      this.chart.setOption(option)
    }
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
