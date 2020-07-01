const helpers = {
  /**
   * Split out different updates into new lines and strip out line name
   */
  formatDetails: function (details) {
    // Add new lines for different updates
    var formattedDetails = details
      .replace(/GOOD SERVICE/g, '\nGOOD SERVICE')
      .replace(/Good Service/g, '\nGOOD SERVICE')
      .replace(/SEVERE DELAYS/g, '\nSEVERE DELAYS')
      .replace(/Severe Delays/g, '\nSEVERE DELAYS')
      .replace(/Severe delays/g, '\nSEVERE DELAYS')
      .replace(/MINOR DELAYS/g, '\nMINOR DELAYS')
      .replace(/Minor Delays/g, '\nMINOR DELAYS')
      .replace(/Minor delays/g, '\nMINOR DELAYS')
      .replace(/A Good Service/g, '\nA Good Service')
      .replace(/No service/g, '\nNO SERVICE');

    // remove line name
    formattedDetails = formattedDetails
      .replace('Bakerloo Line: ', '')
      .replace('BAKERLOO LINE: ', '')
      .replace('Central Line: ', '')
      .replace('CENTRAL LINE: ', '')
      .replace('Circle Line: ', '')
      .replace('CIRCLE LINE: ', '')
      .replace('District Line: ', '')
      .replace('DISTRICT LINE: ', '')
      .replace('Docklands Light Railway: ', '')
      .replace('DLR Line: ', '')
      .replace('DLR LINE: ', '')
      .replace('Hammersmith and City Line: ', '')
      .replace('Hammersmith & City Line: ', '')
      .replace('HAMMERSMITH & CITY LINE: ', '')
      .replace('Jubilee Line: ', '')
      .replace('JUBILEE LINE: ', '')
      .replace('London Overground: ', '')
      .replace('LONDON OVERGROUND: ', '')
      .replace('Metropolitan Line: ', '')
      .replace('METROPOLITAN LINE: ', '')
      .replace('Northern Line: ', '')
      .replace('NORTHERN LINE: ', '')
      .replace('Piccadilly Line: ', '')
      .replace('PICCADILLY LINE: ', '')
      .replace('TfL Rail: ', '')
      .replace('TfL RAIL: ', '')
      .replace('Victoria Line: ', '')
      .replace('VICTORIA LINE: ', '')
      .replace('Waterloo and City Line: ', '')
      .replace('Waterloo & City Line: ', '')
      .replace('WATERLOO & CITY LINE: ', '');

    return formattedDetails;
  },
  /**
   * Return time and text on when the last update was made
   */
  minutesAgo: function (time) {
    var then = new Date(time),
      now = Date.now(),
      text = '',
      // for the 30s update we want the minutes to the nearest half
      hoursAgo = Math.floor((now - then) / 3600000),
      minutesAgo = Math.floor((now - then) / 60000),
      secondsAgo = Math.floor((now - then) / 1000);

    if (secondsAgo < 1) {
      text = 'just now';
    } else if (minutesAgo < 1) {
      // add space before numbers less than 10
      text = (secondsAgo < 10 ? String.fromCharCode(8192) : '') + secondsAgo + 's ago';
    } else if (minutesAgo > 60) {
      text = hoursAgo + ' hours ago';
    } else {
      text = minutesAgo + ' minute' + (minutesAgo > 1 ? 's' : '') + ' ago';
    }

    return {
      text: text,
      minutesAgo: minutesAgo,
    };
  },
};
