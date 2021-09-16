module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '微喵虎斑'
        return args
      })
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "extraResources": {
          "from": "./native/src/Release",
          "to": "native"
        },
        "productName": "微喵虎斑",
        "appId": "com.wemew.chagoi",
        "copyright": "Copyright © 2019",//版权信息
        "directories": {
          "output": "./dist"//输出文件路径
        },
        "mac": {
          "icon": "favicon.icns"
        },
        "win": {
          "icon": "favicon.ico"
        }
      }
    },
    externals: []
  }
}

