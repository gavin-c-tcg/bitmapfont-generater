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
    const xmlMaker = new XMLMaker();

    let textStyle = props.textStyle || {};
    if (!textStyle.fontFamily) textStyle.fontFamily = "Arial";
    if (!textStyle.fontSize) textStyle.fontSize = "20px";
    if (!textStyle.testString) textStyle.testString = Phaser.GameObjects.RetroFont.TEXT_SET1;

    const fontSize = Number(textStyle.fontSize.replace("px", ""));

    const fileName = props.fileName || `${textStyle.fontFamily}${fontSize}`;
    const path = props.path || "./";
    const margin = typeof props.margin === "number" ? props.margin : 1;

    let textSet = props.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1;

    xmlMaker.setConfig({
      fontFamily: textStyle.fontFamily,
      fontSize,
      fileName,
    });

    let txt = this.add.text(0, 0, textSet, textStyle);
    const metrics = txt.getTextMetrics();
    //make rough estimate of the required canvas width
    const maxWidth = Math.ceil(Math.sqrt(txt.width * txt.height) / 512) * 512;
    const rt = this.add.renderTexture(0, 0, maxWidth, 2048);

    txt.setText("");

    //correct fontSize properties for shadow
    let offsetX = 0;
    let offsetY = 0;
    if (!textStyle.metrics && textStyle.shadow) {
      offsetX = Math.ceil(textStyle.shadow.offsetX) || 0;
      offsetY = Math.ceil(textStyle.shadow.offsetY) || 0;
      metrics.fontSize += offsetY;
      metrics.descent += offsetY;
      textStyle.metrics = metrics;
      txt.setStyle(textStyle);
    }

    for (let i = 0; i < textSet.length; i++) {
      txt.setText(textSet[i]);

      const displayWidth = txt.displayWidth;
      const id = txt.text.charCodeAt(0).toString();

      if (txt.x + displayWidth + offsetX > maxWidth) {
        txt.x = 0;
        txt.y += metrics.fontSize + margin;
      }
      //add space in order to capture shadow correctly
      txt.setText(`${textSet[i]} `);
      rt.draw(txt);

      xmlMaker.addChar({
        id: id,
        x: txt.x.toString(),
        y: txt.y.toString(),
        width: (displayWidth + offsetX).toString(),
        height: metrics.fontSize.toString(),
        xoffset: "0",
        yoffset: "0",
        xadvance: displayWidth.toString(),
        page: "0",
      });

      txt.x += displayWidth + offsetX + margin;
    }
    txt.setText("");

    //add common values
    const baselineY = textStyle.baselineY || 1.4;
    xmlMaker.setConfig({
      lineHeight: Math.round((metrics.fontSize - metrics.descent) * baselineY).toString(),
      base: metrics.descent.toString(),
    });

    xmlMaker.output(path);

    //create snapshot
    const img = await new Promise((resolve) => {
      this.game.renderer.snapshotArea(0, 0, maxWidth, txt.y + metrics.fontSize, resolve);
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
