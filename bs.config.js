var historyApiFallback = require('connect-history-api-fallback');

module.exports = {
  server: true,
  proxy: false,
  port: process.env.PORT || 8000,
  open: false,
  logFileChanges: true,
  logLevel: "info",
  files: [
    "build/**",
    // Exclude Map files
    "!build/**.map"
  ],
  server: {
    baseDir: ["build"],
    index: "index.html",
    middleware: [historyApiFallback()]
  }
};
