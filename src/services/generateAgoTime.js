



export default function timeAgo(date) {
   let year , month , day , hour , minute , second ;

   const oldDate = new Date(date).getTime();
   const newDate = new Date().getTime();
   const time = newDate - oldDate ;

   second = Math.floor(time / 1000);
   minute = Math.floor(second / 60);
   second = second % 60;
   hour = Math.floor(minute / 60);
   minute = minute % 60;
   day = Math.floor(hour / 24);
   hour = hour % 24;
   month = Math.floor(day / 30);
   day = day % 30;
   year = Math.floor(month / 12);
   month = month % 12;

   const units = [
      { label: 'Year', value: year },
      { label: 'Month', value: month },
      { label: 'Day', value: day },
      { label: 'Hours', value: hour },
      { label: 'Minute', value: minute },
      { label: 'Second', value: second },
   ];

   // Filter all Units Contain value More than Zero Only :
   const nonZero = units.filter(unit => unit.value > 0);

   if (nonZero.length === 0) return "A few moments ago";  // If All Values Equal Zero 

   // Show First Unit Contain Value :
   const show = `${nonZero[0].value} ${nonZero[0].label}`;
   return `Ago ${show}`;
//    return { year, month, day, hour, minute, second };
}

