
var Tube = (function () {

	var data = [];

	var req = new XMLHttpRequest();

	var requestFeed = function () {
		req.open(
			'GET',
			'http://cloud.tfl.gov.uk/TrackerNet/LineStatus',
			// 'http://localhost/tube/feed2.xml',
			true);
		req.onload = checkEvents;
		req.send(null);
	};

	var checkEvents = function () {
		// check if connected
		if (!req.responseXML) {
			document.getElementsByTagName('body')[0].innerHTML = '<p>Error: no connection to internet or TfL feed</p>';
			return;
		}
		var items = req.responseXML.getElementsByTagName('LineStatus'),
			noGood = 0,
			html = '<div class="main"><a class="popupclosebtn" title="close popup"></a>',
			status = '',
			lineName = '',
			className = '',
			buttonText = 'on',
			message = '<span class="message">No updates set</span>',
			details = false;

		// var d = new Date('10/01/2013 15:37:15 UTC');console.log(d.toString().replace(/GMT.*/g,""))
		// console.log(req.responseXML)
		// console.log(req.responseXML)
		// html += '<p>Last updated: ' + new Date(req.responseXML.lastModified + ' UTC').toString().replace(/GMT.*/g,"") + '</p>';

		for (var i = 0, l = items.length; i < l; i += 1) {
			if (data[i]) {
				className = '';
				buttonText = 'on';
			} else {
				className = 'off ';
				buttonText = 'off';
			}
			status = items[i].getElementsByTagName('Status')[0].getAttribute('Description');
			lineName = items[i].getElementsByTagName('Line')[0].getAttribute('Name');
			className += lineName.toLowerCase().replace(/\s/g, '-');
			/*********************
			service status can be:
			• Suspended 
			• Part Suspended 
			• Planned Closure 
			• Part Closure 
			• Severe Delays 
			• Reduced Service 
			• Bus Service 
			• Minor Delays 
			• Good Service 
			*********************/
			if (status !== 'Good Service') {
				details = items[i].getAttribute('StatusDetails').replace(/GOOD SERVICE/g, '<br />GOOD SERVICE').replace(/MINOR DELAYS/g, '<br />MINOR DELAYS').replace(/A Good Service/g, '<br />A Good Service').replace(/Good Service/g, '<br />Good Service');
			} else {
				details = false;
			}
			html += '<p class="' + className + '">';
			html += '<span class="line">' + lineName + '</span> ';
			html += '<span class="status">' + status + '</span> ' + message + ' <a class="toggle on" data-class="' + className.replace('off ', '') + '" data-pos="' + i + '">' + buttonText + '</a>';
			if (details) {
				if (details.charAt(0) === '<') {
					details = details.substring(6);
				}
				html += ' <span class="details">' + details + '</span>';
			}
			html += '</p></div>';
		}
		document.getElementsByTagName('body')[0].innerHTML = html;
		setIcon();

		document.querySelector('.popupclosebtn').addEventListener('click', function () {
			window.close();
		});
	};

	var settings = function () {
		var toggleButton = document.querySelector('.toggle');

		var toggle = function () {
			var setStatus = this.innerHTML,
				rowClass = this.getAttribute('data-class'),
				setTo = 0,
				pos = parseInt(this.getAttribute('data-pos'), 10);

			if (setStatus === 'on') {
				this.innerHTML = 'off';
				document.querySelector('.' + rowClass).className = rowClass + ' off';
			} else {
				this.innerHTML = 'on';
				setTo = 1;
				document.querySelector('.' + rowClass).className = rowClass;
			}
			data[pos] = setTo === 0 ? false : true;
			storeOptions();
		};

		// create an observer instance
		var observer = new WebKitMutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.addedNodes) {
					for (i = 0, l = mutation.addedNodes.length; i < l; i += 1) {
						mutation.addedNodes[i].querySelector('.toggle').addEventListener('click', toggle);
					}
				} 
			});    
		});

		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true };

		// pass in the target node, as well as the observer options
		observer.observe(document.querySelector('body'), config);
	};

	var storeOptions = function () {
		var opt = [],
			i = 0;
		for (i; i < 13; i += 1) {
			opt[i] = data[i] === true ? 1 : 0;
		}
		localStorage.lines = JSON.stringify(opt);
		setIcon();
	};

	var getOptions = function () {
		var opt = [],
			i = 0;
		opt = JSON.parse(localStorage.lines);
		for (i; i < 13; i += 1) {
			data[i] = opt[i] === 1 ? true : false;
		}
	};

	var setIcon = function () {
		var items = req.responseXML.getElementsByTagName('LineStatus'),
			description = '',
			minorDelays = 0,
			busService = 0,
			reducedService = 0,
			severeDelays = 0,
			partClosure = 0,
			plannedClosure = 0,
			partSuspended = 0,
			suspended = 0,
			partSuspendedLine = '',
			suspendedLine = '',
			severeDelaysLine = '',
			minorDelaysLine = '',
			divider = ' ';

		for (var i = 0, l = items.length; i < l; i += 1) {
			if (data[i]) {
				divider = ' ';
				description = items[i].getElementsByTagName('Status')[0].getAttribute('Description');
				if (description === 'Suspended') {
					if (suspended) {
						divider = ', ';
					}
					suspended += 1;
					suspendedLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
				} else if (description === 'Part Suspended') {
					if (partSuspended) {
						divider = ', ';
					}
					partSuspended += 1;
					partSuspendedLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
				} else if (description === 'Planned Closure') {
					plannedClosure += 1;
				} else if (description === 'Part Closure') {
					partClosure += 1;
				} else if (description === 'Severe Delays') {
					if (severeDelays) {
						divider = ', ';
					}
					severeDelays += 1;
					severeDelaysLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
				}  else if (description === 'Reduced Service') {
					reducedService += 1;
				} else if (description === 'Bus Service') {
					busService += 1;
				} else if (description === 'Minor Delays') {
					if (minorDelays) {
						divider = ', ';
					}
					minorDelays += 1;
					minorDelaysLine += divider + items[i].getElementsByTagName('Line')[0].getAttribute('Name') + ' Line';
				}
			}
		}

		// set icon
		if (suspended > 0) { 
			chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
			chrome.browserAction.setTitle({title: suspendedLine + ' suspended'});
		} else if (partSuspended > 0) { 
			chrome.browserAction.setIcon({path: 'images/bad.png'}); //red
			chrome.browserAction.setTitle({title: partSuspendedLine + ' part suspended'});
		} else if (severeDelays > 0) { 
			chrome.browserAction.setIcon({path: 'images/bad.png'}); //amber
			chrome.browserAction.setTitle({title: severeDelaysLine + ' severe delays'});
		} else if (minorDelays > 0) { 
			chrome.browserAction.setIcon({path: 'images/delay.png'}); //yellow
			chrome.browserAction.setTitle({title: minorDelaysLine + ' minor delays'});
		} else {
			chrome.browserAction.setIcon({path: 'images/good.png'});
			chrome.browserAction.setTitle({title: 'No issues reported'});
		}
	};

	var getActiveLines = function () {
		if (localStorage.lines) {
			getOptions();
		} else {
			for (var i = 0; i < 13; i += 1) {
				data[i] = true;
			}
			storeOptions();
		}
	};

	return {
		update: function () {
			requestFeed();
		},
		init: function () {
			getActiveLines();
			requestFeed();
			document.addEventListener('DOMContentLoaded', settings);
		}()
	};

})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2103529-14']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();