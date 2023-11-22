const ImageSceneGame = require("./ImageSceneGame");

module.exports = {
  type: Phaser.CANVAS,
  width: 1024 * 3,
  height: 1024 * 3,
  autoFocus: false,
  banner: false,
  render: {
    //antialiasGL: false
  },
  "render.transparent": true,
  backgroundColor: "rgba(255,110,110,0)",
  scene: [ImageSceneGame],
};
