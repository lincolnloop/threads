'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    urls = require('../../urls');

module.exports = Backbone.Model.extend({

  idAttribute: 'url',
  maxFilenameLength: 18,

  initialize: function (options) {
    _.bindAll(this, 'save', 'success', 'uploadProgress');

    this.set({'percentComplete': options.percentComplete});

    this.file = options.file ? options.file : null;
    // API gives us `filename`, Browser gives us `file.name`
    options.filename = options.filename || options.file.name;
    // trim long filenames
    if (options.filename.length > this.maxFilenameLength) {
      this.set({short_filename:
                options.filename.slice(0, 4) +
                '&hellip;' +
                options.filename.slice(-10)});
    } else {
      this.set({short_filename: options.filename});
    }
    return this;
  },

  url: function () { return this.id || urls.get('api:attachment'); },

  save: function () {
    /*
     * overrides this.save to use html5 FormData and AJAX uploads instead
     */
    var uploadIframe = window.frames.uploadFileIframe,
        data = new FormData();

    uploadIframe.xhr = new XMLHttpRequest();
    this.xhr = uploadIframe.xhr;

    if (this.get('message')) {
      data.append('message', this.get('message'));
    }
    data.append('attachment', this.file);
    this.xhr.upload.addEventListener('progress', this.uploadProgress, false);
    this.xhr.addEventListener('load', this.success, false);
    // TODO: ohrl is not defined
    // this.xhr.open('POST', ohrl.get('api:fileUpload') + '?format=json', true);
    this.xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
    this.xhr.send(data);

    return this;
  },

  success: function (event) {
    /*
     * sets the ajax response attributes as this objects attributes
     */
    var fileType;
    if (this.get('file')) {
      fileType = this.get('file').type;
    } else {
      fileType = '';
    }
    // TODO: mixpanel is not defined
    // mixpanel.track('attached file', {'type': fileType});
    this.set(JSON.parse(event.target.responseText));
    this.xhr = null;
  },

  uploadProgress: function (event) {
    console.log('Attachement:uploadProgress');
    var percentComplete = 0;
    if (event.lengthComputable) {
      percentComplete = Math.round(event.loaded * 100 / event.total);
      this.set({'percentComplete': percentComplete});
      console.log('Attachment:setPercentComplete' + percentComplete);
    }
  },

  abort: function () {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

});
