let helpers =  {
    /**
     * Split out different updates into new lines and strip out line name
     */
    formatDetails :  function(details) {
        // Add new lines for different updates 
        var formattedDetails = details.replace(/GOOD SERVICE/g, '\nGOOD SERVICE')
                                      .replace(/Good Service/g, '\nGood service')
                                      .replace(/SEVERE DELAYS/g, '\nSEVERE DELAYS')
                                      .replace(/Severe delays/g, '\nSevere delays')
                                      .replace(/MINOR DELAYS/g, '\nMINOR DELAYS')
                                      .replace(/Minor delays/g, '\nMinor delays')
                                      .replace(/A Good Service/g, '\nA Good Service')
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

            // for the 30s update we want the minutes to the nearest half
            minutesAgo = Math.floor((now - then) / 60000),
            secondsAgo = Math.floor((now - then) / 1000);

        if (secondsAgo < 1) {
            return {
                text: 'just now',
                minutesAgo: minutesAgo
            };
        } else if (minutesAgo < 1) {
            return {
                text: secondsAgo + 's ago',
                minutesAgo: minutesAgo
            };
        } else {
            return {
                text: minutesAgo + ' minute' + (minutesAgo > 1 ? 's' : '') + ' ago',
                minutesAgo: minutesAgo
            };
        }
    }
};

export default helpers;