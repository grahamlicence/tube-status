// background
var React = require('react');

var TubeStore = require('./stores/TubeStore');
var DataStore = require('./stores/DataStore');
var Actions = require('./actions/Actions');

function updateIcon() {
    // set icon
    if (TubeStore.plannedClosure() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
        chrome.browserAction.setTitle({title: TubeStore.plannedClosureLine()});
    } else if (TubeStore.suspended() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
        chrome.browserAction.setTitle({title: TubeStore.suspendedLine()});
    } else if (TubeStore.partSuspended() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
        chrome.browserAction.setTitle({title: TubeStore.partSuspendedLine()});
    } else if (TubeStore.severeDelays() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //amber
        chrome.browserAction.setTitle({title: TubeStore.severeDelaysLine()});
    } else if (TubeStore.specialService() > 0) { 
        chrome.browserAction.setIcon({path: 'images/delay.png'}); //alert
        chrome.browserAction.setTitle({title: TubeStore.specialServiceLine()});
    } else if (TubeStore.minorDelays() > 0) { 
        chrome.browserAction.setIcon({path: 'images/delay.png'}); //yellow
        chrome.browserAction.setTitle({title: TubeStore.minorDelaysLine()});
    } else {
        chrome.browserAction.setIcon({path: 'images/good.png'});
        chrome.browserAction.setTitle({title: 'No issues reported'});
    }
}

TubeStore.addChangeListener(updateIcon);
    
Actions.get();
var checker = setInterval(function() {
    Actions.get();
}, 3000); //check every 5 minutes
// }, 300000); //check every 5 minutes

// update icon when settings changed
// chrome.runtime.onMessage.addListener(
//     function(request) {
//     if (request.msg === 'dataupdate') {
//         Actions.update();
//     }
// });