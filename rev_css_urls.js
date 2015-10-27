#!/usr/bin/env node

/* Rewrites CSS URLs in build/versioned based on manifest.txt */

var fs = require('fs');
var path = require('path');
var url = require('url');
var BASEPATH = 'build/versioned';
var manifestPath = path.join(BASEPATH, 'manifest.txt');

function revCssUrls(filepath) {
  /* Search for url(...) in CSS and try to replace with versioned filename */
  var urlPatt = /url\(['"]{0,1}\s*(.*?)["']{0,1}\)/g;

  console.log('In file: ' + filepath);
  var src = fs.readFileSync(path.join(BASEPATH, filepath), "utf8");
  //replace every url(...) with its absolute path
  return src.replace(urlPatt, function (match, urlArg) {
    var replacement = match;
    if (!urlArg.startsWith('data:')) {
      var parsedUrl = url.parse(urlArg);
      // resolve path (without query parameters or hashes)
      var resolved = path.join(path.dirname(filepath), parsedUrl.pathname);
      // find in manifest
      if (resolved in manifest) {
        // convert to relative path and replace query and hash if they existed
        replacement = path.relative(path.dirname(filepath), manifest[resolved]);
        if (parsedUrl.search) {
          replacement += parsedUrl.search;
        }
        if (parsedUrl.hash) {
          replacement += parsedUrl.hash;
        }
        replacement = 'url("' + replacement + '")';
        console.log(' * ' + match + ' -> ' + 'url(\'' + replacement + '\')');
      } else {
        console.log(" * Could not find hashed filename for '" + parsedUrl.pathname + "'");
      }
    }
    return replacement;
  });

  return src;
}

// read manifest
var manifest = {};
var manifestContent = fs.readFileSync(manifestPath, 'utf8');
manifestContent.split('\n').forEach(function (line) {
  var parts = line.split(',');
  if (parts[0] && parts[1]) {
    manifest[parts[0]] = parts[1];
  }
});

// iterate over manifest, updating files in place
Object.keys(manifest).forEach(function (sourceFile) {
  if (sourceFile.endsWith('.css')) {
    // write to versioned file, but read from source for idempotence
    var versionedFilePath = path.join(BASEPATH, manifest[sourceFile]);
    fs.writeFile(versionedFilePath, revCssUrls(sourceFile), function (err) {
      if (err) throw err;
      console.log("Saved '" + manifest[sourceFile] + "'");
    });
  }
});
