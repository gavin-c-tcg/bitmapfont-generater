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

class SceneGame extends Phaser.Scene {
  constructor() {
    super({
      active: true,
      visible: true,
      key: "SceneGame",
    });
  }

  preload() {
    console.log("preload");
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

    const xmlMaker = new XMLMaker();
    xmlMaker.setConfig({
      fontFamily: textStyle.fontFamily,
      fontSize,
      fileName,
    });

    const fontSource = new FontSource(this);
    fontSource.setConfig({ textStyle, textSet, margin });
    fontSource.init();

    const rt = this.add.renderTexture(0, 0, fontSource.maxWidth, 2048);

    let textY = 0;
    for (const { text, char } of fontSource.iterator()) {
      xmlMaker.addChar(char);
      rt.draw(text);
      textY = text.y;
    }

    xmlMaker.setConfig({
      lineHeight: fontSource.lineHeight,
      base: fontSource.base,
    });

    xmlMaker.output(path);

    //create snapshot
    const img = await new Promise((resolve) => {
      this.game.renderer.snapshotArea(0, 0, fontSource.maxWidth, textY + fontSource.metrics.fontSize, resolve);
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

module.exports = SceneGame;
