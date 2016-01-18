// background
var React = require('react');

var TubeStore = require('./stores/TubeStore');
var Actions = require('./actions/Actions');

function checkStatus () {
    // set icon
    Actions.update();
    
    if (TubeStore.plannedClosure() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
        chrome.browserAction.setTitle({title: TubeStore.plannedClosureLine() + ' closed'});
    } else if (TubeStore.suspended() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
        chrome.browserAction.setTitle({title: TubeStore.suspendedLine() + ' suspended'});
    } else if (TubeStore.partSuspended() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
        chrome.browserAction.setTitle({title: TubeStore.partSuspendedLine() + ' part suspended'});
    } else if (TubeStore.severeDelays() > 0) { 
        chrome.browserAction.setIcon({path: 'images/bad.png'}); //amber
        chrome.browserAction.setTitle({title: TubeStore.severeDelaysLine() + ' severe delays'});
    } else if (TubeStore.specialService() > 0) { 
        chrome.browserAction.setIcon({path: 'images/delay.png'}); //alert
        chrome.browserAction.setTitle({title: TubeStore.specialServiceLine() + ' special service'});
    } else if (TubeStore.minorDelays() > 0) { 
        chrome.browserAction.setIcon({path: 'images/delay.png'}); //yellow
        chrome.browserAction.setTitle({title: TubeStore.minorDelaysLine() + ' minor delays'});
    } else {
        chrome.browserAction.setIcon({path: 'images/good.png'});
        chrome.browserAction.setTitle({title: 'No issues reported'});
    }
}
    
checkStatus();
var checker = setInterval(function() {
    checkStatus();
}, 300000); //check every 5 minutes

// update icon when settings changed
chrome.runtime.onMessage.addListener(
    function(request) {
    if (request.msg === 'dataupdate') {
        checkStatus();
    }
});