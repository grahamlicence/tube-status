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

function setData() {
    var opt = [],
        i = 0;
    if (localStorage.lines) {
        opt = JSON.parse(localStorage.lines);
        for (i; i < Constants.LINES; i++) {
            _data[i] = opt[i] === 1;
        }
    } else {
        for (i; i < Constants.LINES; i++) {
            _data[i] = true;
        }
    }
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

        for (var i = 0, l = items.length; i < l; i += 1) {
            if (_data[i]) {
                divider = ' ';
                description = items[i].getElementsByTagName('Status')[0].getAttribute('Description');
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
            }
        }
}

/**
* @return {object}
*/
function updateData() {
    _data = 'ok';
    _req.open(
        'GET',
        // TODO use new TfL api for JSON
        'http://cloud.tfl.gov.uk/TrackerNet/LineStatus',
        true);
    _req.onload = filterData;
    _req.send(null);
}


// /**
// * Filter the list by input value 
// * @param {Object} val - filter input text
// * @return {object}
// */
// function filter(val) {
//     var updatedList = _names;
//     updatedList = updatedList.filter(function(item){
//         return item.name.toLowerCase().search(
//             val.toLowerCase()) !== -1;
//     });
//     _items = updatedList;
// }



// /**
// * Sort the array by defined value
// * @private
// * @param {String} val - value to sort array by
// * @param {Boolean} highToLow - high to low or low to high
// */
// function sortItems (val, highToLow) {
//     _items = _items.sort(function(a, b) {
//         if (highToLow) {
//             if (a[val] > b[val]) {
//                 return 1;
//             }
//             if (a[val] < b[val]) {
//                 return -1;
//             }
//             return 0; // matches
//         } else {
//             if (a[val] < b[val]) {
//                 return 1;
//             }
//             if (a[val] > b[val]) {
//                 return -1;
//             }
//             return 0;
//         }
//     });
// }

// /**
// * Save a name
// * @param {Object} name - name to be saved
// */
// function save(name) {
//     _saved.push(name);
// }

// /**
// * Remove a name
// * @param {Object} name - name to be removed
// */
// function del(name) {
//   for (var n = 0; n < _saved.length; n++) {
//     if (_saved[n].name == name.name) {
//       var removedObject = _saved.splice(n,1);
//       removedObject = null;
//       break;
//     }
//   }
// }


const TubeStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the staus of tube lines.
    * @return {object}
    */
    getStatus: function() {
        return _items;
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

  // /**
  //  * Check if name saved.
  //  * @return {object}
  //  */
  // isSaved: function(name) {
  //   for (var i = 0; i < _saved.length; i++) {
  //       if (_saved[i].name === name) {
  //           return true;
  //       }
  //   }
  //   return false;
  // },

  // /**
  //  * Get the saved names.
  //  * @return {object}
  //  */
  // getSaved: function() {
  //   return _saved;
  // },

  // /**
  //  * Get the sorted/filtered items.
  //  * @return {object}
  //  */
  // getItems: function() {
  //   return _items;
  // },

  emitChange: function() {
    this.emit(Constants.CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(Constants.CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(Constants.CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    // case Constants.DELETE:
    //     del(action.item);
    //     TubeStore.emitChange();
    //   break;

    // case Constants.SAVE:
    //     save(action.item);
    //     TubeStore.emitChange();
    //   break;

    case Constants.UPDATE:
        updateData();
        TubeStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TubeStore;