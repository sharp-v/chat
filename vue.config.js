module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        components: "@/components",
        views: "@/views",
        common: "@/common",
        service: "@/service",
        http: "@/service/http",
        websocket: "@service/websocket",
      },
    },
    // 不打包 ./chat-backend/文件夹 还没配置好。。。
    // rules: [
    //   {
    //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    //     loader: "url",
    //     exclude: /chat-backend/,
    //   },
    // ],
  },
  outputDir: "./chat-backend/static",

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
};
