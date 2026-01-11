
export const generateDate = ()=>{
   //! Get the current date and time
   const currentDate = new Date();
   //! Set the time zone offset for Egypt (UTC+2:00)
   const timeZoneOffset = 1 ; // in minutes
   // const timeZoneOffset = 60 / 60; // in minutes
   //! Apply the time zone offset
   currentDate.setMinutes(currentDate.getMinutes() + timeZoneOffset);
   //! Get the options for formatting the date and time
   const options = {
   year: 'numeric',
   month: '2-digit',
   day: '2-digit',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
   hour12: true,
   timeZone: 'Africa/Cairo' // Specify the time zone explicitly
   //  timeZone ==>   "Africa/Cairo"  "America/New_York"  "Europe/London"  "Asia/Tokyo"  "Australia/Sydney"  "Indian/Mauritius"   "UTC"
   };


   //! Format the date and time as a string
   const dateTime = currentDate.toLocaleString('en-EG', options);             //  ==> toLocaleString: 01/24/2025, 09:24:54 AM
  //   const dateTime = currentDate.toDateString('en-EG', options)            //  ==> toDateString (Local): Fri Jan 24 2025 
  //   const dateTime = currentDate.toISOString('en-EG', options)             //  ==> toISOString (UTC): 2025-01-24T07:24:54.154Z
  //   const dateTime = currentDate.toTimeString('en-EG', options)            //  ==> toTimeString (Local): 09:24:54 GMT+0200 (Egypt Standard Time)
  //   const dateTime = currentDate.toUTCString('en-EG', options)             //  ==> toUTCString (UTC): Fri, 24 Jan 2025 07:24:54 GMT
  //   const dateTime = currentDate.toLocaleDateString('en-EG', options)      //  ==> toLocaleDateString: 01/24/2025
  //   const dateTime = currentDate.toLocaleTimeString('en-EG', options)      //  ==> toLocaleTimeString: 09:24:54 AM
   // return dateTime ;



   const [datePart, timePart] = dateTime.split(', ') ;
   const [month, day, year] = datePart.split('/') ;


   return `${day}/${month}/${year}, ${timePart}`;
}
