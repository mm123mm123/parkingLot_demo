<template>
  <div :key="'chart' + _uid" ref="chart" class="echarts"></div>
</template>

<script>
export default {
  props: {
    color: {
      type: Array,
      default: () => ['rgba(110, 193, 237, 1)', 'rgba(238, 117, 42, 1)', 'rgba(22, 117, 117, 1)', 'rgba(245, 169, 110, 1)',]
    }
  },
  data() {
    return {
      chart: null
    }
  },
  methods: {
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height, MAX) {
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
      let hoverRate = isHovered ? 1.85 : 1.8

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
            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y: function (u, v) {
          if (u < startRadian) {
            return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
            return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z: function (u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u);
          }
          return Math.sin(v) > 0 ? 7 * height / MAX + 1 : -1
        }
      }
    },
    getPie3D(pieData, internalDiameterRatio) {
      const MAX = Math.max(...pieData.map(x => x.value))
      let series = []
      let sumValue = 0
      let startValue = 0
      let endValue = 0
      let legendData = []
      let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3

      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i++) {

        sumValue += pieData[i].value;

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

      for (let i = 0; i < series.length; i++) {
        // endValue = startValue + series[i].pieData.value
        endValue = startValue + sumValue / series.length
        // console.log(series[i]);
        series[i].pieData.startRatio = startValue / sumValue
        series[i].pieData.endRatio = endValue / sumValue
        series[i].parametricEquation = this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, (series[i].pieData.value), MAX)
        startValue = endValue

        legendData.push(series[i].name)
      }


      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      let option = {

        color: this.color,
        tooltip: {
          formatter: params => {
            if (params.seriesName !== 'mouseoutSeries') {
              // console.log(params)
              return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`;
            }
          }
        },
        legend: {
          show: false,
          data: legendData,
          textStyle: {
            color: '#fff',
            fontSize: 26
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
          boxHeight: 20,
          top: '10%',
          // bottom: '50%',
          viewControl: {
            distance: 300,
            alpha: 25,
            beta: 130,
          },

        },
        series: series
      };
      return option
    },
    // initChart() {
    //   this.chart = this.$echarts.init(this.$refs.chart)
    //   let option = this.getPie3D([], 0.8)
    //   this.chart.setOption(option)
    // },
    setData(data) {
      this.chart = this.$echarts.init(this.$refs.chart)
      let option = this.getPie3D(data, 0.8)
      this.chart.setOption(option)
    }
  },
  mounted() {
    // this.initChart()
  },
  beforeDestroy() {
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
