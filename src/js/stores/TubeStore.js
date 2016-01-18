var AppDispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var Actions = require('../actions/Actions');

// service data
var _data = setData(),
    _req = new XMLHttpRequest(),
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
    console.log(data);
    return data;
}

var storeOptions = function () {
    var opt = [],
        i = 0;
    for (i; i < 14; i++) {
        opt[i] = _data[i].active === true ? 1 : 0;
    }
    localStorage.lines = JSON.stringify(opt);
};

function updateShown(id, active) {
    if (active) {
        _data[id].active = false;
    } else {
        _data[id].active = true;
    }
    storeOptions();
    filterData();

    TubeStore.emitChange();

    // update background
    chrome.runtime.sendMessage({msg: 'dataupdate'});
}

function filterData() {
    var items = _req.responseXML.getElementsByTagName('LineStatus'),
        divider = ' ';

        // reset status
        description = '';
        minorDelays = 0;
        busService = 0;
        reducedService = 0;
        severeDelays = 0;
        partClosure = 0;
        plannedClosure = 0;
        partSuspended = 0;
        suspended = 0;
        specialService = 0;
        partSuspendedLine = '';
        suspendedLine = '';
        severeDelaysLine = '';
        minorDelaysLine = '';
        specialServiceLine = '';
        plannedClosureLine = '';

        for (var i = 0, l = items.length; i < l; i++) {
            _data[i].line = items[i].getElementsByTagName('Line')[0].getAttribute('Name');
            _data[i].details = '';
            
            // check if status required for this line
            if (_data[i].active) {
                divider = ' ';
                description = items[i].getElementsByTagName('Status')[0].getAttribute('Description');
                _data[i].description = description;
                if (description === 'Suspended') {
                    if (suspended) {
                        divider = ', ';
                    }
                    suspended += 1;
                    suspendedLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
                } else if (description === 'Part Suspended') {
                    if (partSuspended) {
                        divider = ', ';
                    }
                    partSuspended += 1;
                    partSuspendedLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
                } else if (description === 'Planned Closure' || description === 'Service Closed') {
                    if (plannedClosure) {
                        divider = ', ';
                    }
                    plannedClosure += 1;
                    plannedClosureLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
                } else if (description === 'Part Closure') {
                    partClosure += 1;
                } else if (description === 'Severe Delays') {
                    if (severeDelays) {
                        divider = ', ';
                    }
                    severeDelays += 1;
                    severeDelaysLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
                } else if (description === 'Special Service') {
                    if (specialService) {
                        divider = ', ';
                    }
                    specialService += 1;
                    specialServiceLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
                }  else if (description === 'Reduced Service') {
                    reducedService += 1;
                } else if (description === 'Bus Service') {
                    busService += 1;
                } else if (description === 'Minor Delays') {
                    if (minorDelays) {
                        divider = ', ';
                    }
                    minorDelays += 1;
                    minorDelaysLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
                }

                if (status !== 'Good Service') {
                    _data[i].details = items[i].getAttribute('StatusDetails').replace(/GOOD SERVICE/g, '\nGOOD SERVICE').replace(/SEVERE DELAYS/g, '\nSEVERE DELAYS').replace(/MINOR DELAYS/g, '\nMINOR DELAYS').replace(/A Good Service/g, '\nA Good Service').replace(/Good Service/g, '\nGood Service').replace(/No service/g, '\nNo service');
                    if (_data[i].details.charAt(0) === '<') {
                        _data[i].details = _data[i].details.substring(6);
                    }
                }

            }
        }
        console.log('after ajax');
        console.log(_data);
        TubeStore.emitChange();
}

/**
* @return {object}
*/
function updateData() {
    _data = setData();
    _req.open(
        'GET',
        // TODO use new TfL api for JSON
        'http://cloud.tfl.gov.uk/TrackerNet/LineStatus',
        true);
    _req.onload = filterData;
    _req.send(null);
}

const TubeStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the staus of tube lines.
    * @return {object}
    */
    getData: function() {
        return _data;
    },

    description: function() {
        return description;
    },

    plannedClosure: function() {
        return plannedClosure;
    },
    plannedClosureLine: function() {
        return plannedClosureLine + ' planned closure';
    },

    suspended: function() {
        return suspended;
    },

    suspendedLine: function() {
        return suspendedLine + ' suspended';
    },

    partSuspended: function() {
        return partSuspended;
    },
    partSuspendedLine: function() {
        return partSuspendedLine + ' part suspended'
    },
    severeDelays: function() {
        return severeDelays;
    },
    severeDelaysLine: function() {
        return severeDelaysLine + ' severe delays'
    },
    specialService: function() {
        return specialService;
    },
    specialServiceLine: function() {
        return specialServiceLine + ' special service'
    },
    minorDelays: function() {
        return minorDelays;
    },
    minorDelaysLine: function() {
        return minorDelaysLine + ' minor delays'
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

    case Constants.UPDATE:
        updateData();
        console.log('update')
      break;

    case Constants.SET:
        updateShown(action.id, action.active);
      break;

    default:
      // no op
  }
});

module.exports = TubeStore;