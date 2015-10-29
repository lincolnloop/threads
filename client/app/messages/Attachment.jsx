'use strict';

var _ = require('underscore');
var React = require('react');
var truncate = require('../utils/truncate');
var config = require('../utils/config');

var Attachment = React.createClass({

  render: function() {
    var att = this.props.attachment;
    var filename = truncate(att.filename, 23);
    var thumbnail = att.thumbnail;
    var fileType;
    var downloadUrl = config.apiUrl + att.attachment;
    // get a thumbnail from the file extension
    if (!thumbnail) {
      fileType = filename.split('.')[1];
      if (_.indexOf(['gif', 'png', 'doc', 'jpg'], fileType) === -1) {
        fileType = 'file';
      }
      thumbnail = '/assets/img/file-icons/' + fileType + '.gif';
    }
    thumbnail = config.apiUrl + thumbnail;
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
