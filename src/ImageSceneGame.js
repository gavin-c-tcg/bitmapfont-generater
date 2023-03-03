const fs = require("fs");
const fse = require("fs-extra");
const nodepath = require("path");
const convert = require("xml-js");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const Jimp = require("jimp");
const Pixelizer = require("image-pixelizer");
const { XMLMaker } = require("./XMLMaker");
const { ImageMaker } = require("./ImageMaker");
const { FontSource } = require("./FontSource");
const { ImageSource } = require("./ImageSource");

class ImageSceneGame extends Phaser.Scene {
  constructor() {
    super({
      active: true,
      visible: true,
      key: "ImageSceneGame",
    });
  }

  preload() {
    console.log("preload");

    this.imgs = [];
    const fontDir = "./images/time-number";
    const fontFiles = fs.readdirSync(fontDir);
    fontFiles.forEach((fontFile) => {
      const fontPath = nodepath.join(fontDir, fontFile);
      const fileName = nodepath.basename(fontPath);
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

      const base64 = fs.readFileSync(fontPath, { encoding: "base64" });
      const base64Url = `data:image/png;base64,${base64}`;

      this.textures.addBase64(fileName[0], base64Url);
      this.imgs.push({ key: fileName[0], fileNameWithoutExtension, fileName, fontPath });
    });
  }
  async create() {
    //quick and dirty hack to wait for data to be available in the registry
    await new Promise((resolve) => setTimeout(resolve, 5));

    const props = this.game.registry.get("props");

    let textStyle = props.textStyle || {};
    if (!textStyle.fontFamily) textStyle.fontFamily = "Arial";
    if (!textStyle.fontSize) textStyle.fontSize = "20px";
    if (!textStyle.testString) textStyle.testString = Phaser.GameObjects.RetroFont.TEXT_SET1;

    const fontSize = Number(textStyle.fontSize.replace("px", ""));

    const fileName = props.fileName || `${textStyle.fontFamily}${fontSize}`;
    const path = props.path || "./";
    const margin = typeof props.margin === "number" ? props.margin : 1;

    let textSet = props.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1;

    //========================================

    const source = new ImageSource(this);
    source.setConfig({
      imgs: this.imgs,
      lineHeight: 12,
      base: 12,
    });
    source.init();
    const xmlMaker = new XMLMaker();
    xmlMaker.setConfig({ fontFamily: textStyle.fontFamily, fontSize, fileName });

    // const fontSource = new FontSource(this);
    // fontSource.setConfig({ textStyle, textSet, margin });
    // fontSource.init();

    const texture = this.add.renderTexture(0, 0, 2048, 2048);

    for (const { text, char } of source.iterator()) {
      xmlMaker.addChar(char);
      texture.draw(text);
    }

    if (source.fontSize) xmlMaker.setConfig({ fontSize: source.fontSize });

    xmlMaker.setConfig({ lineHeight: source.lineHeight, base: source.base });

    xmlMaker.output(path);

    //create snapshot
    const img = await new Promise((resolve) => {
      this.game.renderer.snapshotArea(0, 0, source.maxWidth, source.maxHeight, resolve);
    });

    // ==== processing the image ====

    const compressionOptions = typeof props.compression === "null" ? NULL : props.compression || { quality: [0.3, 0.5] };
    const maxNumberOfColors = props.maxNumberOfColours;
    const antialias = props.antialias !== false;
    const imageMaker = new ImageMaker();
    imageMaker.setConfig({
      base64Url: img.src,
      antialias,
      maxNumberOfColors,
      compressionOptions,
      fileName,
    });
    await imageMaker.output(path);

    //close engine
    this.game.registry.get("close")();
  }
}

module.exports = ImageSceneGame;
