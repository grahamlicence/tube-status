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
  }

};

module.exports = Actions;