var React = require('react');
var ReactDOM = require('react-dom');

var Popup = require('./components/Popup');

ReactDOM.render(<Popup/>, document.getElementsByClassName('main')[0]);

chrome.runtime.onSuspendCanceled.addListener(function() {
    console.log('chrome woke up')
})
chrome.runtime.onSuspend.addListener(function() {
    console.log('chrome suspend')
})