const fs = require("fs");
const fse = require("fs-extra");
const nodepath = require("path");

const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const Jimp = require("jimp");
const Pixelizer = require("image-pixelizer");

exports.ImageSource = class ImageSource {
  offsetX = 0;
  margin = 1;
  lineHeight = 0;
  base = 0;
  fontSize = 72;
  imgs = [];
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;
  }

  setConfig(config = {}) {
    // if (config.imgs) this.imgs = config.imgs;
    if (config.lineHeight) this.lineHeight = config.lineHeight;
    if (config.base) this.base = config.base;
    if (config.fontFamily) this.fontFamily = config.fontFamily;
    if (config.fontSize) this.fontSize = config.fontSize;
  }

  loadImg(fontDir) {
    const fontFiles = fs.readdirSync(fontDir);
    fontFiles.forEach((fontFile) => {
      const fontPath = nodepath.join(fontDir, fontFile);
      const fileName = nodepath.basename(fontPath);
      // const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

      const base64 = fs.readFileSync(fontPath, { encoding: "base64" });
      const base64Url = `data:image/png;base64,${base64}`;

      this.scene.textures.addBase64(fileName[0], base64Url);
      this.imgs.push({ key: fileName[0] });
    });
  }

  init() {}

  *iterator() {
    let x = 0;
    let y = 0;
    let maxHeight = 0;
    let maxWidth = 0;
    let lineHeight = 0;
    let base = 0;

    for (const { key } of this.imgs) {
      const img = this.scene.add.image(x, y, key).setOrigin(0, 0);

      const displayWidth = img.displayWidth;
      const id = key.charCodeAt(0).toString();

      // if (img.x + displayWidth + this.offsetX > this.maxWidth) {
      //   img.x = 0;
      //   img.y += this.metrics.fontSize + this.margin;
      // }
      //add space in order to capture shadow correctly

      // rt.draw(txt);
      lineHeight = Math.max(this.lineHeight, img.height);
      base = lineHeight;

      maxHeight = Math.max(maxHeight, img.height);
      maxWidth = x + displayWidth + this.offsetX + this.margin;
      yield {
        text: img,
        char: {
          id: id,
          x: img.x.toString(),
          y: img.y.toString(),
          width: (displayWidth + this.offsetX).toString(),
          height: img.height.toString(),
          xoffset: "0",
          yoffset: "0",
          xadvance: displayWidth.toString(),
          page: "0",
        },
      };

      x += displayWidth + this.offsetX + this.margin;
      img.destroy();
    }

    this.lineHeight = this.lineHeight || lineHeight;
    this.base = this.base || base;

    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    // const textY = txt.y;
  }
};

// fontSource.setConfig
// fontSource.init
// fontSource.iterator

// fontSource.lineHeight
// fontSource.base
// fontSource.maxWidth
// fontSource.maxHeight
