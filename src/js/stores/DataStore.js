var AppDispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var Actions = require('../actions/Actions');
var Config = require('../Config');

// service data
var _req = new XMLHttpRequest(),
    _response = [];

var CHANGE_EVENT = 'change';

_req.responseType = 'json';

/**
 * Save the API data
 */
function saveData () {
    localStorage.data = JSON.stringify(_response);
}

/**
* Data has been updated
*/
function dataUpdated() {
    _response = _req.response;
    _response[0].lastUpdated = Date.now();
    saveData();
    Actions.updateData();
    // send message to background and popup that data has been updated
    chrome.runtime.sendMessage({msg: 'dataupdate'});
}

/**
* API call
*/
function getData() {
    // var url = 'https://api.tfl.gov.uk/Line/Mode/tube,dlr,overground,tflrail/Status?detail=True&app_id=' + Config.appId + '&app_key=' + Config.appKey;
    var url = 'http://localhost:8000/data.json';
    _req.open(
        'GET',
        url,
        true);
    _req.onload = dataUpdated;
    _req.send(null);
}

const DataStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case Constants.GET:
        getData();
      break;

    default:
      // no op
  }
});

module.exports = DataStore;