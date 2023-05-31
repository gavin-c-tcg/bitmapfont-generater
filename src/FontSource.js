const fs = require("fs");
const fse = require("fs-extra");
const nodepath = require("path");

const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const Jimp = require("jimp");
const Pixelizer = require("image-pixelizer");

exports.FontSource = class FontSource {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;
  }
  setConfig(config = {}) {
    if (config.textSetDetail) this.textSetDetail = config.textSetDetail;
    if (config.textSet) this.textSet = config.textSet;
    if (config.margin) this.margin = config.margin;
    if (config.textStyle) {
      let textStyle = config.textStyle || {};
      if (!textStyle.fontFamily) textStyle.fontFamily = "Arial";
      if (!textStyle.fontSize) textStyle.fontSize = "20px";
      // if (!textStyle.testString) textStyle.testString = Phaser.GameObjects.RetroFont.TEXT_SET1;

      this.textStyle = textStyle;
      this.fontSize = Number(textStyle.fontSize.replace("px", ""));
      this.fontFamily = textStyle.fontFamily;
    }
  }

  init() {
    // console.log("init");
    this.initMetricsInfo();
    this.initShadowOffect();
    this.initAscentDescent();
    const baselineY = this.textStyle.baselineY || 1.4;
    this.lineHeight = Math.round((this.metrics.fontSize - this.metrics.descent) * baselineY).toString();
    this.base = this.metrics.descent.toString();
  }

  initMetricsInfo() {
    const txt = this.scene.make
      .text({ x: 0, y: 0 }, false)
      .setStyle(this.textStyle || {})
      .setText(this.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1);
    const metrics = txt.getTextMetrics();

    this.metrics = metrics;
    // this.width = txt.width;
    // this.height = txt.height;
    this.maxWidth = Math.ceil(Math.sqrt(txt.width * txt.height) / 512) * 512;

    txt.setText("");
    txt.destroy();
  }

  initShadowOffect() {
    //correct fontSize properties for shadow
    let offsetX = 0;
    let offsetY = 0;
    if (!this.textStyle.metrics && this.textStyle.shadow) {
      offsetX = Math.ceil(this.textStyle.shadow.offsetX) || 0;
      offsetY = Math.ceil(this.textStyle.shadow.offsetY) || 0;
      this.metrics.fontSize += offsetY;
      this.metrics.descent += offsetY;
      this.textStyle.metrics = this.metrics;
    }
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  initAscentDescent() {
    const addAscent = Math.ceil(this.textStyle.addAscent) || 0;
    const addDescent = Math.ceil(this.textStyle.addDescent) || 0;
    this.metrics.fontSize += addAscent;
    this.metrics.ascent += addAscent;
    this.metrics.descent += addDescent;
    this.metrics.fontSize += addAscent + addDescent;
    this.metrics.ascent += addAscent;
  }

  *iterator() {
    const txt = this.scene.make
      .text(
        {
          x: 0,
          y: 0,
          style: {
            ...this.textStyle,
            metrics: {
              descent: this.metrics.descent,
              fontSize: this.metrics.fontSize,
              ascent: this.metrics.ascent,
            },
          },
        },
        false
      )
      // .setStyle(this.textStyle || {})
      .setText(this.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1);

    for (let i = 0; i < this.textSet.length; i++) {
      txt.setText(this.textSet[i]);

      const displayWidth = txt.displayWidth;
      let marginValue = 0;
      const id = txt.text.charCodeAt(0).toString();

      if (txt.x + displayWidth + this.offsetX > this.maxWidth) {
        txt.x = 0;
        txt.y += this.metrics.fontSize + this.margin;
      }
      //add space in order to capture shadow correctly
      txt.setText(`${this.textSet[i]} `);
      // rt.draw(txt);
      if (this.textSetDetail[this.textSet[i]]) {
        marginValue = this.textSetDetail[this.textSet[i]].addWidth;
      }
      yield {
        text: txt,
        char: {
          id: id,
          x: txt.x.toString(),
          y: txt.y.toString(),
          width: (displayWidth + this.offsetX + marginValue).toString(),
          height: this.metrics.fontSize.toString(),
          xoffset: "0",
          yoffset: "0",
          xadvance: displayWidth.toString(),
          page: "0",
        },
      };

      txt.x += displayWidth + this.offsetX + this.margin;
    }

    this.maxHeight = txt.y + this.metrics.fontSize;
    // const textY = txt.y;
    txt.setText("");
    txt.destroy();
  }
};
