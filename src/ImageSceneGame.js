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

    const props = this.game.registry.get("props");

    if (props.textStyle) {
      this.source = new FontSource(this);
      this.source.setConfig({
        textStyle: props.textStyle,
        textSet: props.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1,
        margin: typeof props.margin === "number" ? props.margin : 1,
        textSetDetail: props.textSetDetail || undefined,
      });
    }

    if (props.images) {
      this.source = new ImageSource(this);
      this.source.loadImg(props.images.fontDir);
      this.source.setConfig({
        fontFamily: props.images.fontFamily || Date.now().toString(),
        imgs: this.imgs,
        lineHeight: props.images.lineHeight,
        base: props.images.base,
        fontSize: props.fontSize,
      });
    }
  }
  async create() {
    //quick and dirty hack to wait for data to be available in the registry
    await new Promise((resolve) => setTimeout(resolve, 5));

    const props = this.game.registry.get("props");

    const fileName = props.fileName || `${Date.now()}`;
    const path = props.path || "./output";

    //========================================

    const source = this.source;

    source.init();
    const xmlMaker = new XMLMaker();
    xmlMaker.setConfig({});

    const texture = this.add.renderTexture(0, 0, 2048, 2048);

    for (const { text, char } of source.iterator()) {
      xmlMaker.addChar(char);
      texture.draw(text);
    }

    xmlMaker.setConfig({
      fontSize: source.fontSize,
      fontFamily: source.fontFamily,
      fileName,
      lineHeight: source.lineHeight,
      base: source.base,
    });

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
