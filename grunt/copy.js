'use strict';

module.exports = {
  fonts: {
    files: [
      {
        expand: true,
        cwd: 'node_modules/font-awesome/fonts/',
        src: '*',
        dest: 'build/fonts/',
        filter: 'isFile'
      },
    ]
  }
};
