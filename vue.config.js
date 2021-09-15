module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "extraResources": {
          "from": "./native/src/Release",
          "to": "native"
        }
      }
    },
    externals: []
  }
}

