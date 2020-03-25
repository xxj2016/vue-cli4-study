'use strict'
const path = require('path')
const defaultSettings = require('./src/config/index.js')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = defaultSettings.title || 'vue mobile template' // page title
// const port = 9018 // dev port
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  vant: 'vant',
  axios: 'axios'
}
// cdn
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    css: ['https://cdn.jsdelivr.net/npm/vant@beta/lib/index.css'],
    js: [
      'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js',
      'https://cdn.jsdelivr.net/npm/vant@beta/lib/vant.min.js'
    ]
  }
}
module.exports = {
  // publicPath: './', // router hash 模式使用
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/app/', //router history模式使用 需要区分生产环境和开发环境，不然build会报错
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  // devServer: {
  //   https: false,
  //   host: 'localhost',
  //   port: port,
  //   open: false,
  //   overlay: {
  //     warnings: false,
  //     errors: true
  //   },
  //   proxy: {
  //     //设置代理，必须填
  //     '/api': {
  //       //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
  //       target: 'http://t.yushu.im', //代理的目标地址，这是豆瓣接口地址网址
  //       changeOrigin: true, //是否设置同源，输入是的
  //       pathRewrite: {
  //         //路径重写
  //         '^/api': '/api' //选择忽略拦截器里面的单词
  //       }
  //     }
  //   }
  // },
  devServer: {
    host: 'localhost',
    // port: 3000, // 启动端口
    // 代理
    proxy: {
      // 拦截请求是以 /common 开头的接口，代理访问到 https://www.hinsenoo.com
      // 例：https://www.hinsenoo.com/common/api
      // 当访问到 /u 时会转发到 target
      // '/common': {
      //   // 代理的目标地址,接口的域名
      //   target: 'https://www.vue-js.com',
      //   secure: false, // 如果是https接口，需要配置这个参数
      //   // 若接口跨域，则要将主机头的源点更改为 url 地址，设为 true
      //   changeOrigin: true,
      //   // 路径转发规则：重写请求，把 /api 置为空
      //   // 比如 源点访问的是 /commom/api/path, 那么会解析为 /api/path
      //   pathRewrite: {
      //     // 把 /common 置为空
      //     '/common': ''
      //   }
      // },
      '/swipes': {
        target: 'http://localhost:3000/swipes',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/swipes': ''
        }
      },
      '/v2/movie/in_theaters': {
        target: 'http://t.yushu.im/v2/movie/in_theaters',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/v2/movie/in_theaters': ''
        }
      }
    }
  },

  configureWebpack: config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      // externals里的模块不打包
      Object.assign(config, {
        name: name,
        externals: externals
      })
    }
    // 为开发环境修改配置...
    // if (process.env.NODE_ENV === 'development') {
    // }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))

    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          },
          libs: {
            name: 'chunk-libs',
            chunks: 'initial', // only package third parties that are initially dependent
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
