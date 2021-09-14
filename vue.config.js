module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "extraResources": {
          "from": "./native/",
          "to": "native"
        }
      }
    },
    externals: []
  }
}

