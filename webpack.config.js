const path = require("path");

let outputname = "lazyhtml.js";
if (process.env.NODE_ENV === "production") {
  outputname = "lazyhtml.min.js";
}

module.exports = {
  entry: "./index.js",
  output: {
    filename: outputname,
    path: path.join(__dirname, "/dist"),
  },
  plugins: [],
};
