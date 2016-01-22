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
                                       .replace('Central Line: ', '')
                                       .replace('Circle Line: ', '')
                                       .replace('District Line: ', '')
                                       .replace('DLR Line: ', '')
                                       .replace('Hammersmith & City Line: ', '')
                                       .replace('Jubilee Line: ', '')
                                       .replace('London Overground: ', '')
                                       .replace('Metropolitan Line: ', '')
                                       .replace('Northern Line: ', '')
                                       .replace('Piccadilly Line: ', '')
                                       .replace('TfL Rail: ', '')
                                       .replace('Victoria Line: ', '')
                                       .replace('Waterloo & City Line: ', '');

    return formattedDetails;
  }
}

export default helpers;