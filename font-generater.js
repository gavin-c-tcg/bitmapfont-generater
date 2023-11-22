const generator = require("./src/index");

exports.genRobotoThinItalic = async () => {
  let resolution = 4;
  let fontSize = 20;
  await generator.TextStyle2BitmapFont({
    path: "./output/Roboto-Regular",
    fileName: `Roboto-Regular`,
    textSet:
      Phaser.GameObjects.RetroFont.TEXT_SET1 +
      "iíìỉĩịuúùủũụưứừửữựyýỳỷỹỵoóòỏõọôốồổỗộơớờởỡợaáàảãạeéè" +
      "ẻẽẹêếềểễệăắằẳẵặâấầẩẫậIÍÌỈĨỊUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢAÁÀ" +
      "ẢÃẠEÉÈẺẼẸÊẾỀỂỄỆĂẮẰẲẴẶÂẤẦẨẪẬỖỖỖỖỖỖ" +
      "ỖỖỀẮẲẴỂỄỖỖỖỐỒỔỖẤẦẨẪẾỖỖỖ" +
      "Đ",
    textSetDetail: {
      Ơ: { addWidth: 15 },
      ơ: { addWidth: 15 },
      Ờ: { addWidth: 15 },
      Ư: { addWidth: 15 },
      ư: { addWidth: 15 },
      Ư: { addWidth: 15 },
      Ứ: { addWidth: 15 },
      Ừ: { addWidth: 15 },
      Ử: { addWidth: 15 },
      Ữ: { addWidth: 15 },
      Ự: { addWidth: 15 },
      Ộ: { addWidth: 15 },
      Ơ: { addWidth: 15 },
      Ớ: { addWidth: 15 },
      Ờ: { addWidth: 15 },
      Ở: { addWidth: 15 },
      Ỡ: { addWidth: 15 },
      Ợ: { addWidth: 15 },
      ư: { addWidth: 15 },
      ứ: { addWidth: 15 },
      ừ: { addWidth: 15 },
      ử: { addWidth: 15 },
      ữ: { addWidth: 15 },
      ự: { addWidth: 15 },
      ơ: { addWidth: 15 },
      ớ: { addWidth: 15 },
      ờ: { addWidth: 15 },
      ở: { addWidth: 15 },
      ỡ: { addWidth: 15 },
      ợ: { addWidth: 15 },
    },
    margin: 20,
    textStyle: {
      addAscent: 8,
      addDescent: 5,
      xOffsetPercent: 0,
      yOffsetPercent: -0.12,

      fontFamily: "Roboto-Regular",
      fontSize: `${resolution * fontSize}px`,
      align: "center",
      // stroke: "#000",
      // strokeThickness: resolution,
      color: "#ffffff",
      // shadow: {
      //   offsetX: 0.5 * resolution,
      //   offsetY: 0.5 * resolution,
      //   blur: 0,
      //   fill: true,
      //   stroke: true,
      //   color: "#000000",
      // },
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
