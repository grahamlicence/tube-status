let helpers =  {
  formatDetails :  function(details) {
    // Add new lines for different updates 
    var formattedDetails = details.replace(/GOOD SERVICE/g, '\nGOOD SERVICE')
                                  .replace(/SEVERE DELAYS/g, '\nSEVERE DELAYS')
                                  .replace(/MINOR DELAYS/g, '\nMINOR DELAYS')
                                  .replace(/A Good Service/g, '\nA Good Service')
                                  .replace(/Good Service/g, '\nGood Service')
                                  .replace(/No service/g, '\nNo service');

    // remove line name
    formattedDetails = formattedDetails.replace('Bakerloo Line: ', '')
                                       .replace('BAKERLOO LINE: ', '')
                                       .replace('Central Line: ', '')
                                       .replace('CENTRAL LINE: ', '')
                                       .replace('Circle Line: ', '')
                                       .replace('CIRCLE LINE: ', '')
                                       .replace('District Line: ', '')
                                       .replace('DISTRICT LINE: ', '')
                                       .replace('DLR Line: ', '')
                                       .replace('DLR LINE: ', '')
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
                                       .replace('TFL RAIL: ', '')
                                       .replace('Victoria Line: ', '')
                                       .replace('VICTORIA LINE: ', '')
                                       .replace('Waterloo & City Line: ', '')
                                       .replace('WATERLOO & CITY LINE: ', '');

    return formattedDetails;
  },
  minutesAgo: function (time) {
    var then = new Date(time),
      now = Date.now(),
      timePassed = parseInt((now - then) / 6000) / 10;

    if (timePassed < 0.5) {
      return 'just now';
    } else if (timePassed < 1) {
      return '30s ago';
    } else if (timePassed < 2) {
      return '1 minute ago';
    } else {
      return parseInt(timePassed) + ' minutes ago';
    }
  }
}

export default helpers;