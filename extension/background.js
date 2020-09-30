// service data
const _req = new XMLHttpRequest();
let _response = [];
_req.responseType = 'json';

const _issues = {
  suspended: [],
  severe: [],
  minor: [],
  partClosure: [],
  noService: [],
};

/**
 * Set the data for which lines shown
 * @return {object} data - array of lines
 */
function setData() {
  var opt = [],
    i = 0,
    LINES = 15, // number of TfL managed lines
    data = [];
  const lines = localStorage.getItem('lines');

  if (lines) {
    opt = JSON.parse(lines);
    for (i; i < LINES; i++) {
      data.push({ active: opt[i] === 1, id: i });
    }
  } else {
    localStorage.setItem('lines', JSON.stringify([...Array(15).fill(1)]));
    for (i; i < LINES; i++) {
      data.push({ active: true, id: i });
    }
  }
  data.severity = 'offline';
  return data;
}

/**
 * Filter the api data
 */
function filterData() {
  var i = 0,
    status = 0,
    details = 0,
    timepassed;

  // reset data based on active lines
  _data = setData();

  // load saved json
  // _response = loadData();

  // good service unless specified
  _data.severity = 'good';

  // save the time the data was updated
  _data.updated = _response[0].lastUpdated;
  _data[_response.length] = { updated: _data.updated };

  // remove errors
  _error = localStorage.error;

  // clear down issues
  // TODO: refactor using Object.keys(_issues)
  _issues.suspended.length = 0;
  _issues.severe.length = 0;
  _issues.minor.length = 0;
  _issues.noService.length = 0;
  _issues.partClosure.length = 0;

  // TODO: refactor into smaller blocks
  // might be better moved to DataStore and stored in localhost, so all done in background.js
  for (; i < _response.length; i++) {
    _data[i].line = _response[i].name;
    _data[i].details = [];
    _data[i].description = [];

    // only check active lines
    if (_data[i].active) {
      // there can be more than one status update, eg part closed and delays on rest of line
      // lines can also have delays on different parts, eg Overground 2 severe delays and 1 minor delay
      for (status = 0; status < _response[i].lineStatuses.length; status++) {
        if (_data[i].description.indexOf(_response[i].lineStatuses[status].statusSeverityDescription) < 0) {
          _data[i].description.push(_response[i].lineStatuses[status].statusSeverityDescription);
        }

        // only add reasons if there
        if (_response[i].lineStatuses[status].reason) {
          _data[i].details.push(helpers.formatDetails(_response[i].lineStatuses[status].reason));
        }

        // remove duplicate details
        for (details = 1; details < _data[i].details.length; details++) {
          // remove spaces when checking as sometimes has trailing space in details
          if (_data[i].details[details].replace(/\s+/g, '') === _data[i].details[details - 1].replace(/\s+/g, '')) {
            _data[i].details.splice(details, 1);
          }
        }

        switch (_response[i].lineStatuses[status].statusSeverityDescription) {
          case 'Suspended':
            _data.severity = 'bad';
            // Only add each line once
            if (_issues.suspended.indexOf(_response[i].name) < 0) {
              _issues.suspended.push(_response[i].name);
            }
            break;
          case 'Part Suspended':
          case 'Severe Delays':
            _data.severity = 'bad';
            if (_issues.severe.indexOf(_response[i].name) < 0) {
              _issues.severe.push(_response[i].name);
            }
            break;

          case 'Minor Delays':
            if (_data.severity !== 'bad') {
              _data.severity = 'delay';
            }
            if (_issues.minor.indexOf(_response[i].name) < 0) {
              _issues.minor.push(_response[i].name);
            }
            break;

          case 'Planned Closure':
          case 'Service Closed':
            if (_data.severity !== 'bad' && _data.severity !== 'delay') {
              _data.severity = 'closure';
            }
            if (_issues.noService.indexOf(_response[i].name) < 0) {
              _issues.noService.push(_response[i].name);
            }
            break;

          case 'Special Service':
          case 'Reduced Service':
          case 'Part Closure':
          case 'Bus Service':
            if (_data.severity !== 'bad' && _data.severity !== 'delay') {
              _data.severity = 'closure';
            }
            if (_issues.partClosure.indexOf(_response[i].name) < 0) {
              _issues.partClosure.push(_response[i].name);
            }
            break;
        }
      }
    }
  }

  localStorage.lineData = JSON.stringify(_data);

  updateIcon();

  chrome.runtime.sendMessage({ msg: 'dataupdate' });
}

/**
 * Return lines with issues
 * @return {string}
 */
function lineIssue(lines, issueText) {
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
    issueType = ['suspended', 'severe', 'minor', 'partClosure', 'noService'],
    text = [
      'Suspended service on ',
      'Severe delays on ',
      'Minor delays on ',
      'Part Closure of ',
      'No Service on ',
      'Good service on all lines',
    ],
    issues = _issues;

  for (var i = 0; i < issueType.length; i++) {
    title += lineIssue(issues[issueType[i]], text[i], i === issueType.length - 1);
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
  var icon = _data.severity,
    titleText = getTitle();

  if (_data.severity === 'offline') {
    titleText = 'Unable to connect to API';
  }

  chrome.browserAction.setIcon({ path: 'images/' + icon + '.png' });
  chrome.browserAction.setTitle({ title: titleText });
}

/**
 * Save the API data
 */
function saveData() {
  localStorage.data = JSON.stringify(_response);
}

/**
 * Save the API error data
 */
function saveError(error) {
  localStorage.error = error;
}

/**
 * Data has been updated
 */
const dataUpdated = () => {
  _response = _req.response;
  _response[0].lastUpdated = Date.now();
  saveData();
  filterData();
};

/**
 * API call
 */
const getData = () => {
  var url =
    'https://api.tfl.gov.uk/Line/Mode/tube,dlr,overground,tflrail,tram/Status?detail=True&app_id=' +
    config.appId +
    '&app_key=' +
    config.appKey;
  // var url = 'http://localhost:8080/data.json';

  // check if online before updating
  if (navigator.onLine) {
    _req.open('GET', url, true);
    _req.onload = dataUpdated;
    _req.send(null);
  } else {
    console.log('failed to get data');
  }
};

const init = () => {
  getData();

  //check API every 5 minutes
  chrome.alarms.create('apiChecker', {
    when: 1000,
    periodInMinutes: 4,
  });

  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === 'apiChecker') {
      getData();
    }
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.msg === 'settingsupdate') {
      filterData();
    }
  });
};

init();
