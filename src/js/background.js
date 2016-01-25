// background
var React = require('react');

var TubeStore = require('./stores/TubeStore');
var DataStore = require('./stores/DataStore');
var Actions = require('./actions/Actions');

function updateIcon() {
    var data = TubeStore.getData(),
        icon = data.severity;

    chrome.browserAction.setIcon({path: 'images/' + icon + '.png'});
}

TubeStore.addChangeListener(updateIcon);
    
Actions.get();

//check API every 5 minutes
chrome.alarms.create('apiChecker', {
    when: 1000,
    periodInMinutes: 5
})

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === 'apiChecker') {
        Actions.get();
    }
});

// listener for popup active lines updates
chrome.runtime.onMessage.addListener(function (request) {
    if (request.msg === 'iconupdate') {
        Actions.updateLines();
    } else if (request.msg === 'dataoutofdate') {
        Actions.get();
    }
});
