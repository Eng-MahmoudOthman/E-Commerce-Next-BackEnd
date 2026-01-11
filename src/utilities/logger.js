



// import { createLogger, transports, format } from "winston";
// const logger = createLogger({
//    level: "info", // مستوى التسجيل: info, error, warn
//    format: format.combine(
//       format.timestamp(), // يضيف وقت
//       format.json()       // يخلي اللوج بصيغة JSON
//    ),
//    transports: [
//       new transports.Console(), // يطبع في التيرمنال
//       new transports.File({ filename: "app.log" }) // يسجل في ملف app.log
//    ]
// });

// export default logger;










// import moment from "moment-timezone";
// import { createLogger, transports , format } from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";
// const logger = createLogger({
//    level: "info",

//    //^ Timestamp in the all World :
//    // format: format.combine(
//    //    format.timestamp(),
//    //    format.json()
//    // ),



//    //^ Timestamp in egypt only :
//    format: format.combine(
//       format.timestamp({
//          format: () => moment().tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss")
//       }),
//       format.json()
//    ),
//    transports: [
//       // new transports.Console() ,
//       new (DailyRotateFile)({
//          dirname: "logs/log",            // فولدر يحفظ فيه
//          filename: "app-%DATE%.log", // اسم الملف بتاريخ
//          datePattern: "YYYY-MM-DD",  // "YYYY-MM-DD" كل يوم ملف جديد   -- "YYYY-MM" ⇒ يعمل ملف لكل شهر. --  "YYYY-MM-DD-HH" ⇒ يعمل ملف جديد كل ساعة. 
//          zippedArchive: true,        // يضغط الملفات القديمة .gz
//          maxSize: "20m",             // أقصى حجم للملف (20 ميجا)
//          maxFiles: "30d"             // يحتفظ بآخر 30 يوم بس
//       }) ,
//    ]
// });
// // Logger مخصص للـ Requests
// const requestLogger = createLogger({
//    level: "info",
   
//    //^ Timestamp in egypt only :
//    format: format.combine(
//       format.timestamp({
//          format: () => moment().tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss")
//       }),
//       format.json()
//    ),
//    transports: [
//       new DailyRotateFile({
//          dirname: "logs/requests",      // فولدر مختلف
//          filename: "request-%DATE%.log", // اسم مختلف
//          datePattern: "YYYY-MM-DD",
//          zippedArchive: true,
//          maxSize: "20m",
//          maxFiles: "30d",
//       }),
//    ],
// });
// export {logger , requestLogger};













// import { createLogger, transports, format } from "winston";

// const logger = createLogger({
//   level: "info", // المستوى الافتراضي (info وما فوقه)
//   format: format.combine(
//     format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // الوقت
   //  format.printf(({ level, message, timestamp }) => {
   //    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
   //  })
//   ),
//   transports: [
//     // يطبع في الكونسول
//     new transports.Console(),

//     // يخزن في ملف logs/app.log
//     new transports.File({ filename: "logs/app.log" })
//   ]
// });

// export default logger;










// Deployment By Vercel :
import { createLogger, format, transports } from "winston";
import moment from "moment-timezone";
const logger = createLogger({
   level: "info",
   format: format.combine(
      format.timestamp({
         format: () => moment().tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss")
      }),
      format.json()
   ),
   transports: [
      new transports.Console() // بس يطبع في Logs بتاعت Vercel
   ]
});
const requestLogger = createLogger({
   level: "info",
   
   //^ Timestamp in egypt only :
   format: format.combine(
      format.timestamp({
         format: () => moment().tz("Africa/Cairo").format("YYYY-MM-DD HH:mm:ss")
      }),
      format.json()
   ),
   transports: [
      new transports.Console() // بس يطبع في Logs بتاعت Vercel
   ]
});
export {logger , requestLogger};



