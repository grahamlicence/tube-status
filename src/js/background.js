// background
var React = require('react');

var TubeStore = require('./stores/TubeStore');
var DataStore = require('./stores/DataStore');
var Actions = require('./actions/Actions');

/**
  * Return lines with issues
  * @return {string} 
  */
function lineIssue(lines, issueText, lastLine) {
    var text = '',
        divider = ', ',
        dividerText = '';

    if (!lines.length) {
        return text;
    }
    text += issueText;

    for (var i = 0; i < lines.length; i++) {
        if (i === 0) {
            dividerText = '';
        } else if (i === lines.length - 1) {
            dividerText = ' and ';
        } else {
            dividerText = divider;
        }
        text = text + dividerText + lines[i];
    }

    // add pluralisation of lines and new line 
    text += ' line' + (lines.length > 1 ? 's' : '') + '\n';

    return text;
}

/**
  * Set title text
  * @return {string} 
  */
function getTitle() {
    var title = '',
        divider = ', ',
        issueType = [
            'severe',
            'minor',
            'partClosure',
            'noService'
        ],
        text = [
            'Severe delays on ',
            'Minor delays on ',
            'Part Closure of ',
            'No Service on ',
            'Good service on all lines'
        ],
        issues = TubeStore.getIssues();

    for (var i = 0; i < issueType.length; i++) {
        title += lineIssue(issues[issueType[i]], text[i], (i === issueType.length - 1));
    }

    if (title.length) {
        // remove last new line
        return title.slice(0, -1);
    } else {
        return text[4];
    }
        
}

/**
 * Update extension icon
 */
function updateIcon() {
    var data = TubeStore.getData(),
        icon = data.severity;

    chrome.browserAction.setIcon({path: 'images/' + icon + '.png'});
    chrome.browserAction.setTitle({title: getTitle()});
}

// listen for user changes to update icon
TubeStore.addChangeListener(updateIcon);
    
// initial API call on load
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
