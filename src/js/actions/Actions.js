var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  /**
   * update the data shown
   */
  update: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATE
    });
  },

  /**
   * get the TfL feed
   */
  get: function() {
    AppDispatcher.dispatch({
      actionType: Constants.GET
    });
  },

  /**
   * @param id {Object} Line id
   * @param active {Boolean} Line status shown
   */
  set: function(id, active) {
    AppDispatcher.dispatch({
      actionType: Constants.SET,
      id: id,
      active: active
    });
  }

};

module.exports = Actions;