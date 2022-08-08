const path = require("path");

module.exports = (env) => {
  const isProduction = env.production === "true";
  return {
    entry: "./index.js",
    output: {
      filename: isProduction ? 'lazyhtml.min.js' : "lazyhtml.js",
      path: path.join(__dirname, "/dist"),
      //https://webpack.docschina.org/guides/author-libraries#expose-the-library
      library:{
        name:'LazyHtml',
        type:'umd'
      }
    },
    plugins: [],
  };
};
