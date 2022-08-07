module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': "@/assets",
        "components": "@/components",
        "views": "@/views",
        "common": "@/common",
        "service": "@/service",
        "http": "@/service/http",
        'websocket': '@service/websocket'
      }
    }
  },
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.137.1:8080', //API服务器的地址
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   },
  // }
}