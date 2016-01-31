var AppDispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var Actions = require('../actions/Actions');
var Config = require('../Config');
var h = require('../helpers');

// service data
var _data = setData(),
    _issues = {
        severe: [],
        minor: [],
        partClosure: [],
        noService: []
    },
    _response = [],
    _error = '',
    CHANGE_EVENT = 'change';

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
function storeOptions () {
    var opt = [],
        i = 0;
    for (i; i < 14; i++) {
        opt[i] = _data[i].active === true ? 1 : 0;
    }
    localStorage.lines = JSON.stringify(opt);
}

/**
* Get the data saved from the api.
* @return {object} api response
*/
var loadData = function () {
    return JSON.parse(localStorage.data);
};

/**
* Update the active lines (those whose updates are shown)
*/
function updateShown(id, active) {
    if (active) {
        _data[id].active = false;
    } else {
        _data[id].active = true;
    }
    storeOptions();
    filterData();

    // update background for icon changes
    chrome.runtime.sendMessage({msg: 'iconupdate'});
}

/**
* Filter the api data
*/
function filterData() {

    var i = 0,
        status = 0,
        details = 0;

    // reset data based on active lines
    _data = setData();

    // load saved json
    _response = loadData();

    // good service unless specified
    _data.severity = 'good';

    // save the time the data was updated
    _data.updated = _response[0].lastUpdated;

    // remove errors
    _error = localStorage.error;

    // clear down issues
    // TODO: refactor using Object.keys(_issues)
    _issues.severe.length = 0;
    _issues.minor.length = 0;
    _issues.noService.length = 0;
    _issues.partClosure.length = 0;

    // TODO: refactor into smaller blocks
    // might be better moved to DataStore and stored in localhost
    for (; i < _response.length; i++) {
        _data[i].line = _response[i].name;
        _data[i].details = [];
        _data[i].description = [];
    
        // only check active lines
        if (_data[i].active) {

            // there can be more than one status update, eg part closed and delays on rest of line
            // lines can also have delays on different parts, eg Overground 2 severe delays and 1 minor delay
            for (status = 0; status < _response[i].lineStatuses.length; status++) {
                if (_data[i].description.indexOf(_response[i].lineStatuses[status].statusSeverityDescription) < 0) {
                    _data[i].description.push(_response[i].lineStatuses[status].statusSeverityDescription);
                }
                
                // only add reasons if there
                if (_response[i].lineStatuses[status].reason) {
                    _data[i].details.push(h.formatDetails(_response[i].lineStatuses[status].reason));
                }

                // remove duplicate details
                for (details = 1; details < _data[i].details.length; details++) {
                    if (_data[i].details[details] === _data[i].details[details - 1]) {
                        _data[i].details.splice(details, 1);
                    }
                }

                console.log(i + ' - ' + _response[i].lineStatuses[status].statusSeverityDescription)

                switch (_response[i].lineStatuses[status].statusSeverityDescription) {
                    case 'Suspended':
                    case 'Part Suspended':
                    case 'Severe Delays':
                        _data.severity = 'bad';
                        // Only add each line once
                        if (_issues.severe.indexOf(_response[i].name) < 0) {
                            _issues.severe.push(_response[i].name);
                        }
                        break;

                    case 'Minor Delays':
                        if (_data.severity !== 'bad') {
                            _data.severity = 'delay';
                        }
                        if (_issues.minor.indexOf(_response[i].name) < 0) {
                            _issues.minor.push(_response[i].name);
                        }
                        break;

                    case 'Planned Closure':
                    case 'Service Closed':
                        if (_data.severity !== 'bad' && _data.severity !== 'delay') {
                            _data.severity = 'closure';
                        }
                        if (_issues.noService.indexOf(_response[i].name) < 0) {
                            _issues.noService.push(_response[i].name);
                        }
                        break;

                    case 'Special Service':
                    case 'Reduced Service':
                    case 'Part Closure':
                    case 'Bus Service':
                        if (_data.severity !== 'bad' && _data.severity !== 'delay') {
                            _data.severity = 'closure';
                        }
                        if (_issues.partClosure.indexOf(_response[i].name) < 0) {
                            _issues.partClosure.push(_response[i].name);
                        }
                        break;
                }
            }
        }   

        // checker for when more than one update, often this seems to be duplicate data
        if (_response[i].lineStatuses.length > 1) {
            console.log('Statuses: ' + _response[i].lineStatuses.length + ', ' + _response[i].name)
            console.log(_response[i].lineStatuses)
        }

    }
            // console.log(_issues)
            // console.log(_data)
        
    TubeStore.emitChange();
}


const TubeStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the staus of tube lines.
    * @return {object}
    */
    getData: function() {
        return _data;
    },

    /**
    * List current issues.
    * @return {object}
    */
    getIssues: function() {
        return _issues;
    },

    /**
    * List current issues.
    * @return {object}
    */
    getErrors: function() {
        return _error;
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

  }
});

module.exports = TubeStore;