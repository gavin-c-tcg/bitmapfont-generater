const generator = require("./src/index");

exports.genRobotoThinItalic = async () => {
  let resolution = 4;
  let fontSize = 28;
  await generator.TextStyle2BitmapFont({
    path: "./output/Roboto-ThinItalic",
    fileName: `BBwit`,
    textSet: Phaser.GameObjects.RetroFont.TEXT_SET1,
    textStyle: {
      fontFamily: "Roboto-ThinItalic",
      fontSize: `${resolution * fontSize}px`,
      align: "center",
      stroke: "#000",
      strokeThickness: resolution,
      color: "#ffffff",
      shadow: {
        offsetX: 0.5 * resolution,
        offsetY: 0.5 * resolution,
        blur: 0,
        fill: true,
        stroke: true,
        color: "#000000",
      },
    },
  });
};

exports.genTimeNumber = async () => {
  await generator.TextStyle2BitmapFont({
    path: "./output/time-number",
    fileName: `TimeNumber`,
    images: {
      fontDir: "./images/time-number",
      fontFamily: "TimeNumber",
      // lineHeight: 116,
      // base: 116,
      // fontSize: 72
    },
  });
};
