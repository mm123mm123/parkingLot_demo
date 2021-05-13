const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const businessNames = [
  'Parking'
]

const bigScreenNames = [
  'Parking'
]

module.exports = {
  publicPath: './',
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@public', resolve('public'))
      .set('@compo', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
      .set('@img', resolve('src/assets/img'))
      .set(`@v_compo`, resolve(`src/BigScreen/components`))
      .set(`@v_img`, resolve(`src/BigScreen/assets/img`))
    businessNames.forEach(x => {
      config.resolve.alias
        .set(`@${x}_compo`, resolve(`src/Business/${x}/components`))
        .set(`@${x}_img`, resolve(`src/Business/${x}/assets/img`))
    })
    bigScreenNames.forEach(x => {
      config.resolve.alias
        .set(`@v_${x}_compo`, resolve(`src/BigScreen/${x}/components`))
        .set(`@v_${x}_img`, resolve(`src/BigScreen/${x}/assets/img`))
    })
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 50000000,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    '@jiaminghi/data-view'
  ]
}
