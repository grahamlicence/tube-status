let helpers =  {
    /**
     * Split out different updates into new lines and strip out line name
     */
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
            timePassed = parseInt((now - then) / 6000) / 10;

        if (timePassed < 0.5) {
            return {
                text: 'just now',
                time: 0
            };
        } else if (timePassed < 1) {
            return {
                text: '30s ago',
                time: 0.5
            };
        } else if (timePassed < 2) {
            return {
                text: '1 minute ago',
                time: 1
            };
        } else {
            return {
                text: parseInt(timePassed) + ' minutes ago',
                time: parseInt(timePassed)
            };
        }
    }
}

export default helpers;