

import mongoose from "mongoose";



export const dbConnection = async ()=>{
   if(process.env.NODE_ENV === "production"){
      await mongoose.connect(process.env.URL_CONNECTION_DB_ONLINE_ATLAS).then(()=>{
         console.log(`✅ dbConnect Online  Name: ${process.env.URL_CONNECTION_DB_ONLINE_ATLAS.split("/")[3]} ....`);
      }).catch((error)=>{
         console.log("❌ Fail dbConnection Online ! " );
      })
   }else{
      await mongoose.connect(process.env.URL_CONNECTION_DB_OFFLINE ).then(()=>{
         console.log(`✅ dbConnection Name: ${process.env.URL_CONNECTION_DB_OFFLINE.split("/")[3]} ....`); })
      .catch((error)=>{
         console.log("❌ Fail dbConnection ! ");
      })
   }
} ;















// //& Data Base Local Connection :
// export const dbConnection = async ()=>{
//    await mongoose.connect(process.env.URL_CONNECTION_DB_OFFLINE ).then(()=>{
//       console.log(`✅ dbConnection Name: ${process.env.URL_CONNECTION_DB_OFFLINE.split("/")[3]} ....`); })
//    .catch((error)=>{
//       console.log("❌ Fail dbConnection ! ");
//    })
// }















// // & Data Base Online Connection By Atlas :
// export const dbConnection = async ()=>{
//    await mongoose.connect(process.env.URL_CONNECTION_DB_ONLINE_ATLAS).then(()=>{
//       console.log(`✅ dbConnect Online  Name: ${process.env.URL_CONNECTION_DB_ONLINE_ATLAS.split("/")[3]} ....`);
//    }).catch((error)=>{
//       console.log("❌ Fail dbConnection Online ! " );
//    })
// } ;



