var AppDispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var Actions = require('../actions/Actions');
var Config = require('../Config');
var h = require('../helpers');

// service data
var _data = setData(),
    _req = new XMLHttpRequest(),
    _response = [],
    description = '',
    minorDelays = 0,
    busService = 0,
    reducedService = 0,
    severeDelays = 0,
    partClosure = 0,
    plannedClosure = 0,
    partSuspended = 0,
    suspended = 0,
    specialService = 0,
    partSuspendedLine = '',
    suspendedLine = '',
    severeDelaysLine = '',
    minorDelaysLine = '',
    specialServiceLine = '',
    plannedClosureLine = '';

var CHANGE_EVENT = 'change';

/**
* Set the data for the lines shown and save to localhost
* @return {object} data - array of lines
*/
function setData() {
    var opt = [],
        i = 0,
        LINES = 14, // number of TfL managed lines
        data = [];

    if (localStorage.lines) {
        opt = JSON.parse(localStorage.lines);
        for (i; i < LINES; i++) {
            data.push({active: opt[i] === 1, id: i});
        }
    } else {
        for (i; i < LINES; i++) {
            data.push({active: true, id: i});
        }
    }
    return data;
}

/**
* Store which lines are active.
*/
var storeOptions = function () {
    var opt = [],
        i = 0;
    for (i; i < 14; i++) {
        opt[i] = _data[i].active === true ? 1 : 0;
    }
    localStorage.lines = JSON.stringify(opt);
};

/**
* Get the data saved from the api.
* @return {object} api response
*/
var loadData = function () {
    return JSON.parse(localStorage.data);
};

function updateShown(id, active) {
    if (active) {
        _data[id].active = false;
    } else {
        _data[id].active = true;
    }
    storeOptions();
    filterData();

    // update background
    chrome.runtime.sendMessage({msg: 'iconupdate'});
}

/**
* Filter the api data
*/
function filterData() {

    // reset data based on active lines
    _data = setData();

    // load saved json
    _response = loadData();

    // console.log(_response);
    _data.severity = 'good';

    for (var i = 0, l = _response.length; i < l; i++) {
        _data[i].line = _response[i].name;
        _data[i].details = '';
    
        // only check active lines
        if (_data[i].active) {
            _data[i].description = _response[i].lineStatuses[0].statusSeverityDescription;
            
            if (_response[i].lineStatuses[0].reason) {
                _data[i].details = h.formatDetails(_response[i].lineStatuses[0].reason);
            }

            // check severity of issue
            switch (_data[i].description) {
                case 'Suspended':
                case 'Part Suspended':
                case 'Planned Closure':
                case 'Service Closed':
                case 'Severe Delays':
                    _data.severity = 'bad';
                    break

                case 'Special Service':
                case 'Reduced Service':
                case 'Bus Service':
                case 'Minor Delays':
                    if (_data.severity !== 'bad') {
                        _data.severity = 'delay';
                    }
                    break
            }
        }   

        if (_response[i].lineStatuses.length > 1) {
            console.log('Statuses: ' + _response[i].lineStatuses.length + ', ' + _response[i].line)
        }
        
    }
    TubeStore.emitChange();
}


const TubeStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the staus of tube lines.
    * @return {object}
    */
    getData: function() {
        console.log('getting the dats')
        console.log(_data)
        return _data;
    },

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
  var text;

  switch(action.actionType) {

    case Constants.UPDATEDATA:
        filterData();
      break;

    case Constants.UPDATELINES:
        filterData();
      break;

    case Constants.SET:
        updateShown(action.id, action.active);
      break;

    default:
      // no op
  }
});

module.exports = TubeStore;