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
var checker = setInterval(function() {
    Actions.get();
// }, 3000); //check every 5 minutes
}, 300000); //check every 5 minutes

// listener for popup active lines updates
chrome.runtime.onMessage.addListener(
    function(request) {
    if (request.msg === 'iconupdate') {
        Actions.updateLines();
    } else if (request.msg === 'dataoutofdate') {
        console.log(TubeStore.getData().updated)
        console.log('out of date update')
        Actions.get();
    }
});

// TODO update data when waking up chrome
// 
// 
chrome.runtime.onSuspendCanceled.addListener(function() {
    console.log('bg chrome woke up')
})
chrome.runtime.onSuspend.addListener(function() {
    console.log('bg chrome suspend')
})