const fs = require("fs");
const fse = require("fs-extra");
const nodepath = require("path");

const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const Jimp = require("jimp");
const Pixelizer = require("image-pixelizer");

exports.ImageMaker = class ImageMaker {
  setConfig(config = {}) {
    if (config.base64Url) this.base64Url = config.base64Url;
    if (config.antialias) this.antialias = config.antialias;
    if (config.maxNumberOfColors) this.maxNumberOfColors = config.maxNumberOfColors;
    if (config.compressionOptions) this.compressionOptions = config.compressionOptions;
    if (config.fileName) this.fileName = config.fileName;
  }

  async output(path) {
    //convert image to buffer
    var data = this.base64Url.replace(/^data:image\/png;base64,/, "");
    let buffer = Buffer.from(data, "base64");

    if (!this.antialias || this.maxNumberOfColors) {
      let image = await Jimp.read(buffer);

      //this.antialias
      if (!this.antialias) {
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
          // x, y is the position of this pixel on the image
          // idx is the position start position of this rgba tuple in the bitmap Buffer
          // this is the image

          var red = this.bitmap.data[idx + 0];
          var green = this.bitmap.data[idx + 1];
          var blue = this.bitmap.data[idx + 2];
          var alpha = this.bitmap.data[idx + 3];

          this.bitmap.data[idx + 3] = alpha > 128 ? 255 : 0;

          // rgba values run from 0 - 255
          // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
        });
      }

      //reduce number of colors
      if (this.maxNumberOfColors) {
        // Create Options for Pixelizer.
        let options = new Pixelizer.Options().setMaxIteration(4).setNumberOfColors(this.maxNumberOfColors);

        // Create Pixelizer bitmap from jimp.
        let inputBitmap = new Pixelizer.Bitmap(image.bitmap.width, image.bitmap.height, image.bitmap.data);

        // Pixelize!
        let outputBitmap = new Pixelizer(inputBitmap, options).pixelize();

        // Override jimp bitmap and output image.
        image.bitmap.width = outputBitmap.width;
        image.bitmap.height = outputBitmap.height;
        image.bitmap.data = outputBitmap.data;
      }

      //convert image back to buffer
      buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    }

    //compression is done with imageminPngquant because it has the best result
    if (this.compressionOptions) {
      buffer = await imagemin.buffer(buffer, {
        plugins: [imageminPngquant(this.compressionOptions)],
      });
    }

    // check path dir exists and create if not
    if (!fs.existsSync(path)) fs.mkdirSync(path);

    fse.writeFileSync(nodepath.join(path, `${this.fileName}.png`), buffer);
  }
};
