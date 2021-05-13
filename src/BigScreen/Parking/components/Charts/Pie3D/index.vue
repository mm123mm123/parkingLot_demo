<template>
  <div :key="'chart' + _uid" ref="chart" class="echarts"></div>
</template>

<script>
export default {
  props: {
    color: {
      type: Array,
      default: () => ['#F6D24B', '#6099EF', '#60D1A0']
    }
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    setData (data) {
      // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
      const getParametricEquation = (startRatio, endRatio, isSelected, isHovered, k) => {

        // 计算
        let midRatio = (startRatio + endRatio) / 2

        let startRadian = startRatio * Math.PI * 2
        let endRadian = endRatio * Math.PI * 2
        let midRadian = midRatio * Math.PI * 2

        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
          isSelected = false
        }

        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== 'undefined' ? k : 1 / 3

        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
        let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1

        // 返回曲面参数方程
        return {

          u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
          },

          v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
          },

          x: function (u, v) {
            if (u < startRadian) {
              return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            if (u > endRadian) {
              return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
          },

          y: function (u, v) {
            if (u < startRadian) {
              return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            if (u > endRadian) {
              return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
          },

          z: function (u, v) {
            if (u < -Math.PI * 0.5) {
              return Math.sin(u)
            }
            if (u > Math.PI * 2.5) {
              return Math.sin(u)
            }
            return Math.sin(v) > 0 ? 1 : -1
          }
        }
      }

      // 生成模拟 3D 饼图的配置项
      const getPie3D = (pieData, internalDiameterRatio) => {

        let series = []
        let sumValue = 0
        let startValue = 0
        let endValue = 0
        let legendData = []
        let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1

        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {

          sumValue += pieData[i].value

          let seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
              show: false
            },
            pieData: pieData[i],
            pieStatus: {
              selected: false,
              hovered: false,
              k: k
            }
          }

          series.push(seriesItem)
        }

        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        for (let i = 0; i < series.length; i++) {
          endValue = startValue + series[i].pieData.value

          series[i].pieData.startRatio = startValue / sumValue
          series[i].pieData.endRatio = endValue / sumValue
          series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k)

          startValue = endValue

          legendData.push(series[i].name)
        }

        // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        series.push({
          name: 'mouseoutSeries',
          type: 'surface',
          parametric: true,
          wireframe: {
            show: false
          },
          itemStyle: {
            opacity: 0
          },
          parametricEquation: {
            u: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20
            },
            v: {
              min: 0,
              max: Math.PI,
              step: Math.PI / 20
            },
            x: function (u, v) {
              return Math.sin(v) * Math.sin(u) + Math.sin(u)
            },
            y: function (u, v) {
              return Math.sin(v) * Math.cos(u) + Math.cos(u)
            },
            z: function (u, v) {
              return Math.cos(v) > 0 ? 0.1 : -0.1
            }
          }
        })

        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        let option = {
          //animation: false,
          legend: {
            show: false,
            data: legendData
          },
          color: this.color,
          tooltip: {
            formatter: params => {
              if (params.seriesName !== 'mouseoutSeries') {
                return `${params.marker} ${params.seriesName}<br/><div style="text-algin:center;">${option.series[params.seriesIndex].pieData.value}%</div>`
              }
            }
          },
          xAxis3D: {
            min: -1,
            max: 1
          },
          yAxis3D: {
            min: -1,
            max: 1
          },
          zAxis3D: {
            min: -1,
            max: 1
          },
          grid3D: {
            show: false,
            boxHeight: 5,
            // top: '30%',
            bottom: '50%'
          },
          series: series
        }
        return option
      }

      this.chart = this.$echarts.init(this.$refs.chart)
      let option = getPie3D(data)
      this.chart.setOption(option)

      // // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
      // let selectedIndex = ''
      // let hoveredIndex = ''

      // // 监听点击事件，实现选中效果（单选）
      // chart.on('click', function (params) {
      //   // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
      //   let isSelected = !option.series[params.seriesIndex].pieStatus.selected
      //   let isHovered = option.series[params.seriesIndex].pieStatus.hovered
      //   let k = option.series[params.seriesIndex].pieStatus.k
      //   let startRatio = option.series[params.seriesIndex].pieData.startRatio
      //   let endRatio = option.series[params.seriesIndex].pieData.endRatio


      //   // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
      //   if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
      //     option.series[selectedIndex].parametricEquation = getParametricEquation(option.series[selectedIndex].pieData.startRatio, option.series[selectedIndex].pieData.endRatio, false, false, k)
      //     option.series[selectedIndex].pieStatus.selected = false
      //   }

      //   // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
      //   option.series[params.seriesIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k)
      //   option.series[params.seriesIndex].pieStatus.selected = isSelected

      //   // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
      //   isSelected ? selectedIndex = params.seriesIndex : null

      //   // 使用更新后的 option，渲染图表
      //   chart.setOption(option)
      // })


      // // 修正取消高亮失败的 bug
      // chart.on('globalout', function () {


      //   if (hoveredIndex !== '') {
      //     // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
      //     isSelected = option.series[hoveredIndex].pieStatus.selected
      //     isHovered = false
      //     k = option.series[hoveredIndex].pieStatus.k
      //     startRatio = option.series[hoveredIndex].pieData.startRatio
      //     endRatio = option.series[hoveredIndex].pieData.endRatio

      //     // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
      //     option.series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k)
      //     option.series[hoveredIndex].pieStatus.hovered = isHovered

      //     // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
      //     hoveredIndex = ''
      //   }

      //   // 使用更新后的 option，渲染图表
      //   chart.setOption(option)
      // })
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
