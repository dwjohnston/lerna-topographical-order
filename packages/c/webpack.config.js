const path = require('path');


module.exports = {
    target: 'node',
    entry: "./src/c.js", 
  // path and filename of the final output
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
};
