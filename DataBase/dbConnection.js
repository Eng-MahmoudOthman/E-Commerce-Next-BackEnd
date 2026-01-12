

import mongoose from "mongoose";



// //& Data Base Local Connection :
// export const dbConnection = async ()=>{
//    await mongoose.connect(process.env.URL_CONNECTION_DB_OFFLINE ).then(()=>{
//       // logger.info(`MongoDB connected successfully Name: ${process.env.URL_CONNECTION_DB_OFFLINE.split("/")[3]}`);   
//       console.log(`✅ dbConnection Name: ${process.env.URL_CONNECTION_DB_OFFLINE.split("/")[3]} ....`); })
//       // console.log(process.env.URL_CONNECTION_DB_OFFLINE.split("/")[3]);
//    .catch((error)=>{
//       console.log("❌ Fail dbConnection ! ");
//       // logger.error("MongoDB connection failed", { error });
//    })
// }















// & Data Base Online Connection By Atlas :
export const dbConnection = async ()=>{
   await mongoose.connect(process.env.URL_CONNECTION_DB_ONLINE_ATLAS).then(()=>{
      console.log(`✅ dbConnect Online  Name: ${process.env.URL_CONNECTION_DB_ONLINE_ATLAS.split("/")[3]} ....`);
   }).catch((error)=>{
      console.log("❌ Fail dbConnection Online ! " );
   })
} ;



