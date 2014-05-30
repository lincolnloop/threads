'use strict';

var _ = require('underscore');
var React = require('react');
var classSet = require('react/lib/cx');

var Attachment = React.createClass({


  truncate : function (theString, stringLen, separator) {
    if (theString.length <= stringLen) return theString;
    
    separator = separator || '...';
    
    var sepLen = separator.length,
      charsToShow = stringLen - sepLen,
      frontChars = Math.ceil(charsToShow/2),
      backChars = Math.floor(charsToShow/2);
    
    return theString.substr(0, frontChars) + 
      separator + 
      theString.substr(theString.length - backChars);
  },

  render: function() {
    var att = this.props.attachment;
    var filename = this.truncate(att.filename, 23);
    var thumbnail = att.thumbnail;
    var fileType;
    var downloadUrl = 'https://gingerhq.com/' + att.attachment;
    // get a thumbnail from the file extension
    if (!thumbnail) {
      fileType = filename.split('.')[1];
      if (_.indexOf(['gif', 'png', 'doc', 'jpg'], fileType) === -1) {
        fileType = 'file';
      }
      thumbnail = 'https://gingerhq.com/static/img/file-icons/' + fileType + '.gif';
    }
    return (
      <li className="attachment-item">
        <a href={downloadUrl}>
          <img className="item-icon" src={thumbnail} alt={filename} /> 
          <span className="item-name">{filename} </span>
        </a>
      </li>
    );
  }

});

module.exports = Attachment;
