// 公用配置
let publicOptions = {
  // 颜色
  color: ['#4a8fcd', '#639ed5', '#8ebde6', '#37add0'],
  grid: {
    // 表距离边框距离
    left: '55px',
    right: '20px',
    top: '40px',
    bottom: '40px'
  },
  legend: {
    // 图例
    right: '40px',
    top: '8px',
    itemWidth: 30,
    height: 12,
    borderRadius: 10,
    textStyle: {
      // 文字
      color: '#999999',
      fontSize: 14
    },
    itemGap: 16
  },
  xAxis: {
    // x轴
    // type: 'category',
    axisLine: {
      // 轴线
      lineStyle: {
        type: 'dashed',
        color: '#C0C4CC'
      }
    },
    axisTick: {
      // 刻度线
      show: false
    }
  },
  yAxis: {
    // y轴
    axisLine: {
      show: false,
      lineStyle: {
        color: '#C0C4CC'
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  barWidth: '12' // bar宽度
}

// 柱状图
export function setBarOptions (data, name) {
  let xAxisData = []
  let seriesData = []
  let colorList = [
    ['#85C3FE', '#358DD7'],
    ['#A0A7E6', '#977EFE'],
    ['#70DFDC', '#54BAB8']
  ]
  data.forEach(v => {
    if (v) {
      xAxisData.push(v.name)
      seriesData.push(v.value)
    }
  })
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.tooltip = {
    trigger: 'item',
    formatter: params => {
      let { seriesName, name, value } = params
      return `${seriesName} <br/>${name}: ${value} 个`
    }
  }
  options.xAxis.type = 'category' // 类型
  options.xAxis.data = xAxisData
  options.series = [{
    name: name,
    data: seriesData,
    type: 'bar',
    itemStyle: {
      barBorderRadius: 10
    },
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        // 渐变颜色
        { offset: 0, color: '#85C3FE' },
        { offset: 1, color: '#358DD7' }
      ]
    }
  }]
  return options
}

// 多组柱状图
export function setColumnOptions (data, productData) {
  let colorList = [
    ['#85C3FE', '#358DD7'],
    ['#A0A7E6', '#977EFE'],
    ['#70DFDC', '#54BAB8']
  ]
  // let options = { ...this.publicOptions }
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.tooltip = {
    trigger: 'item',
    formatter: params => {
      let { seriesName, name, value, componentIndex } = params
      return `${name} <br/> ${seriesName}: ${value[componentIndex + 1]}`
    }
  }
  options.dataset = {
    // 数据
    source: [productData, ...data]
  }

  options.xAxis.type = 'category' // 类型
  options.series = []
  for (let i = 0; i < productData.length - 1; i++) {
    options.series.push({
      type: 'bar',
      itemStyle: {
        barBorderRadius: 10,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            // 渐变颜色
            { offset: 0, color: colorList[i][0] },
            { offset: 1, color: colorList[i][1] }
          ],
          globalCoord: false // 缺省为 false
        }
      }
    })
  }
  return options
}

// 面积图
export function setAreaOptions (data, name) {
  let axis = []
  let value = []
  data.forEach(v => {
    axis.push(v.name)
    value.push(v.value)
  })
  // let options = { ...this.publicOptions }
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.xAxis.type = 'category'
  options.xAxis.data = axis
  options.xAxis.boundaryGap = false
  options.series = {
    name: name,
    data: value,
    type: 'line',
    color: '#7191FE',
    smooth: true,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#4FB0FD' },
          { offset: 1, color: '#fff' }
        ],
        global: false // 缺省为 false
      }
    }
  }
  return options
}

// 曲线图
export function setLineOptions (data, name) {
  let axis = data.axis
  let value = data.data
  // let options = { ...this.publicOptions }
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.xAxis.type = 'category'
  options.xAxis.boundaryGap = false
  options.xAxis.data = axis
  options.series = [
    {
      name: name[0],
      data: value[0],
      type: 'line',
      color: '#7191FE',
      smooth: true
    },
    {
      name: name[1],
      data: value[1],
      type: 'line',
      color: '#B671BB',
      smooth: true
    }
  ]
  return options
}

// 折线图
export function setLineOptions2 (data, name) {
  let axis = data.axis
  let value = data.data
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.xAxis.type = 'category'
  options.xAxis.boundaryGap = false
  options.xAxis.data = axis
  options.series = value.map((x, i) => ({
    name: name[i],
    data: x,
    type: 'line'
    // smooth: true
  }))
  return options
}

// 仪表盘
export function setGaugeOptions (data) {
  // let options = { ...this.publicOptions }
  let options = JSON.parse(JSON.stringify(publicOptions))
  let color = {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      // 渐变颜色
      { offset: 0, color: '#358DD7' },
      { offset: 1, color: '#85C3FE' }
    ]
  }
  options.xAxis.show = false
  options.series = [
    {
      type: 'gauge',
      radius: '62.5%',
      startAngle: '225',
      endAngle: '-45',
      pointer: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        { value: 1 }
      ],
      axisLine: {
        show: true,
        lineStyle: {
          color: [[1, 'rgba(175, 175, 175, 0.3)']],
          width: 4,
          opacity: 1
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        length: 20,
        lineStyle: {
          color: '#051932',
          width: 0,
          type: 'solid'
        }
      },
      axisLabel: {
        show: false
      }
    },
    {
      type: 'gauge',
      radius: '65%',
      axisTick: { show: false }, // 小刻度
      splitLine: {
        lineStyle: {
          color: '#14B2FF',
          width: 0
        },
        length: 10
      }, // 分隔线
      pointer: { show: false }, // 指针
      axisLabel: { show: false }, // 标签
      axisLine: {
        // 表盘
        show: true,
        lineStyle: {
          width: 10,
          color: [[data.value * 0.01, color], [1, 'rgba(0,0,0,0)']]
        }
      },
      title: {
        // 标题
        offsetCenter: [0, '30%'],
        fontSize: 16,
        color: '#666'
      },
      detail: {
        // 数值
        formatter: '{value}%',
        color: '#358DD7',
        offsetCenter: [0, '0%'],
        fontSize: 32
      },
      data: [{ value: data.value, name: data.name }]
    }
  ]

  return options
}

// 玫瑰图
export function setRoseBarOptions (data, name) {
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.tooltip = {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  }
  options.legend = {
    orient: 'vertical',
    left: '60%',
    top: 'center'
  }
  options.legend.data = data.map(x => x.name)
  options.xAxis.show = false
  options.calculable = true
  options.series = [
    {
      name,
      type: 'pie',
      center: ['30%', 'center'],
      radius: ['45%', '60%'],
      roseType: 'radius',
      label: {
        normal: {
          show: false,
          position: 'inner'
        },
        emphasis: {
          show: true
        }
      },
      lableLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      data
    }
  ]
  return options
}

// 饼图
export function setPieOptions (data, name) {
  let options = JSON.parse(JSON.stringify(publicOptions))
  options.xAxis.show = false
  options.tooltip = {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  }
  options.legend = {
    orient: 'vertical',
    left: '60%',
    top: 'center'
  }
  options.legend.data = data.map(x => x.name)
  options.series = [
    {
      name,
      type: 'pie',
      center: ['30%', 'center'],
      radius: ['45%', '60%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '24',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data
    }
  ]

  return options
}

// 标题
export function getTitle (data) {
  if (!data) return ({ show: false })
  let option = {
    // 是否显示标题组件。
    show: true,
    // 主标题文本，支持使用 \n 换行。
    text: data?.text || '',
    // 主标题文本超链接。
    link: data?.link || '',
    // 指定窗口打开主标题超链接。 'self' 当前窗口打开 blank' 新窗口打开
    target: data?.target || 'blank',
    textStyle: {
      // 文字的颜色。
      color: data?.textStyle?.color || '#333',
      // 文字字体的风格。'normal' 'italic' 'oblique'
      fontStyle: data?.textStyle?.fontStyle || 'normal',
      // 文字字体的粗细。'normal' 'bold' 'bolder' 'lighter' 100 | 200 | 300 | 400...
      fontWeight: data?.textStyle?.fontWeight || 'bolder',
      // 文字的字体系列。
      fontFamily: data?.textStyle?.fontFamily || 'sans-serif',
      // 文字的字体大小
      fontSize: data?.textStyle?.fontSize || 18,

      lineHeight: data?.textStyle?.lineHeight,
    },
    // 副标题文本，支持使用 \n 换行。
    subtext: data?.subtext || '',
    // 副标题文本超链接。
    sublink: data?.subtext || '',
    // 指定窗口打开副标题超链接
    subtarget: data?.subtext || '',

  }
  return option
}
// 图例
export function getLegend (data) {
  if (!data) return ({ show: false })
  let option = {
    show: true,
    ...data
  }
  return option
}
// 网格
export function getGrid (data) {
  if (!data) return ({ show: false })
  let option = {
    show: true,
    ...data
  }
  return option
}
// x轴
export function getXAxis (data) {
  if (!data) return ({ show: false })
  let option = {}
  option.show = true
  option.type = data.type || 'category'
  

  return option
}
// y轴
export function getYAxis (data) {
  if (!data) return ({ show: false })
  let option = {
    show: true,
    ...data
  }
  return option
}
// 提示框
export function getTooltip (data) {
  if (!data) return ({ show: false })
  let option = {
    show: true,
    ...data
  }
  return option
}

export function getOptions (data) {

  // 标题
  const title = getTitle(data.title)
  // 图例
  const legend = getLegend(data.legend)
  // 直角坐标系内绘图网格
  const grid = getGrid(data.grid)
  // x 轴
  const xAxis = getXAxis(data.xAxis)
  // y 轴
  const yAxis = getYAxis(data.yAxis)
  // 提示框
  const tooltip = getTooltip(data.tooltip)

  const options = {
    title,
    legend,
    grid,
    xAxis,
    yAxis,
    tooltip,
  }
  return options
}