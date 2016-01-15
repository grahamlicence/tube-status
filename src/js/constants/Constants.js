var keyMirror = require('keymirror');

module.exports = keyMirror({
  DELETE: null,
  SAVE: null,
  UPDATE: null,
  LINES: 14, // number of TfL managed lines
  CHANGE_EVENT: 'change'
});