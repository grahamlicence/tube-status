var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  /**
   * remove this
   */
  update: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATE
    });
  },

  /**
   * data has been updated
   */
  updateData: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATEDATA
    });
  },

  /**
   * lines shown has been updated
   */
  updateLines: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATELINES
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