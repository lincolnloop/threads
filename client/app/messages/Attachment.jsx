'use strict';

var _ = require('underscore');
var React = require('react');
var classSet = require('react/lib/cx');

var Attachment = React.createClass({

  render: function() {
    var att = this.props.attachment;
    var filename = att.filename;
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
