
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
(function () {
	var Tube = {};

	Tube.req = new XMLHttpRequest();

	var data = [];

	var getOptions = function () {
		var opt = [],
			i = 0;
		if (localStorage.lines) {
			opt = JSON.parse(localStorage.lines);
			for (i; i < 13; i += 1) {
				data[i] = opt[i] === 1 ? true : false;
			}
		} else {
			for (i; i < 13; i += 1) {
				data[i] = true;
			}
		}
	};

	Tube.requestFeed = function () {
		getOptions();
		Tube.req.open(
			'GET',
			'http://cloud.tfl.gov.uk/TrackerNet/LineStatus',
			// 'http://localhost/tube/feed2.xml',
			true);
		Tube.req.onload = Tube.checkEvents;
		Tube.req.send(null);
	};

	Tube.checkEvents = function () {
		var items = Tube.req.responseXML.getElementsByTagName('LineStatus'),
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

	Tube.init = setInterval(function() {
		Tube.requestFeed();
	}, 300000); //check every 5 minutes
	Tube.requestFeed();

})();

