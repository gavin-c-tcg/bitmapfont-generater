// this is an ingenius hack that allows us to run Phaser without a browser
// ... and yes, it took some time to figure out how to do this

const Canvas = require("canvas");
const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");

// get all font file from ./fonts/
const fontDir = "./fonts";
const fontFiles = fs.readdirSync(fontDir);
fontFiles.forEach((fontFile) => {
  const fontPath = path.join(fontDir, fontFile);
  const fileName = path.basename(fontPath);
  const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  Canvas.registerFont(fontPath, { family: fileNameWithoutExtension });
});

const dom = new jsdom.JSDOM(null);
const document = dom.window.document;
const window = dom.window;
window.focus = () => {};

// expose a few things to all the modules
global.document = document;
global.window = window;
global.Canvas = Canvas.Canvas;
global.Image = Canvas.Image;
global.window.CanvasRenderingContext2D = "foo"; // let Phaser think that we have a canvas
global.window.Element = undefined;
global.navigator = { userAgent: "Custom" }; // could be anything
global.HTMLCanvasElement = Canvas.Canvas;

global.HTMLVideoElement = class HTMLVideoElement {};
global.WebGLTexture = class WebGLTexture {};

global.performance = Date;

// fake the xml http request object because Phaser.Loader uses it
global.XMLHttpRequest = function () {};

global.Phaser = Phaser = require("phaser/src/phaser");

module.exports = Phaser;
