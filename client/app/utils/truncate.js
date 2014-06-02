'use strict';

var truncate = function (theString, stringLen, separator) {
  if (theString.length <= stringLen) {
    return theString;
  }
  
  separator = separator || '...';
  
  var sepLen = separator.length;
  var charsToShow = stringLen - sepLen;
  var frontChars = Math.ceil(charsToShow/2);
  var backChars = Math.floor(charsToShow/2);
  
  return theString.substr(0, frontChars) + 
    separator + 
    theString.substr(theString.length - backChars);
};

module.exports = truncate;
