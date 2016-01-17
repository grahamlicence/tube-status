var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  /**
   * @param  {Object} update data
   */
  update: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATE
    });
  },

  set: function(id, active) {
    AppDispatcher.dispatch({
      actionType: Constants.SET,
      id: id,
      active: active
    });
  }

};

module.exports = Actions;