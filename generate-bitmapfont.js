const { genTimeNumber, genRobotoThinItalic } = require("./font-generater");

(async () => {
  // await genRobotoThinItalic();
  await genTimeNumber();
  process.exit(0);
})();
