const convert = require("xml-js");
const nodepath = require("path");
const fs = require("fs");
const fse = require("fs-extra");

exports.XMLMaker = class XMLMaker {
  chars = [];
  constructor() {}

  setConfig(config = {}) {
    if (config.fontFamily) this.fontFamily = config.fontFamily;
    if (config.fontSize) this.fontSize = config.fontSize;
    if (config.fileName) this.fileName = config.fileName;
    if (config.lineHeight) this.lineHeight = config.lineHeight;
    if (config.base) this.base = config.base;
  }

  addChar(char) {
    this.chars.push({
      _attributes: char,
    });
  }

  getTempJson() {
    const json = {
      _declaration: {
        _attributes: { version: "1.0" },
      },
      font: {
        info: {
          _attributes: { face: this.fontFamily, size: this.fontSize },
        },
        common: {
          _attributes: { lineHeight: this.lineHeight || 0, base: this.base || 0 },
        },
        pages: {
          page: {
            _attributes: { id: "0", file: `${this.fileName}.png` },
          },
        },
        chars: {
          char: this.chars,
        },
      },
    };

    return json;
  }

  getXML() {
    const xml = convert.json2xml(this.getTempJson(), {
      compact: true,
      ignoreComment: true,
      // spaces: 4,
    });
    return xml;
  }

  output(path) {
    // check path dir exists and create if not
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

    // write xml file
    fse.writeFileSync(nodepath.join(path, `${this.fileName}.xml`), this.getXML());
  }
};
