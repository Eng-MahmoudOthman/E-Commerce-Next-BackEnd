
//! Handle Error External Express => Start the Code :
process.on("uncaughtException" , (error)=>{
   console.log("Error" , error);
})


import express from 'express'
import { initApp } from './src/initApp.js';
import { dbConnection } from './DataBase/dbConnection.js';
import env from "dotenv"
// import { webhookMiddleWre } from './src/modules/order/order.controller.js';
import { applySecurityMiddlewares } from './src/middleWare/security.js';
import cookieParser from "cookie-parser";









//!========================================================================================
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { logger } from './src/utilities/logger.js';
//!========================================================================================





env.config();
const app = express() ;
const PORT = process.env.PORT || 5000 ;


   app.use(cookieParser());
   app.use(express.json({ limit: '3000kb' })) ;

//!================= MIDDLEWARE SECURITY SETUP ============================================
   applySecurityMiddlewares(app);










//!========================================================================================
   //* Login With Google :
      app.use(passport.initialize());
      passport.use(
         new GoogleStrategy(
         {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
         },(accessToken, refreshToken, profile, done) => {done(null, profile);})
      );
      passport.serializeUser((user, done) => done(null, user));
      passport.deserializeUser((obj, done) => done(null, obj));
//!========================================================================================









//! Serve static files :
// app.use("/" , express.static("Uploads")) ;
// app.use("/pdf" , express.static("Docs")) ;


//& Receive Webhook From Paymob :
// app.post("/webhook" , webhookMiddleWre)

console.log("🚀 New version deployed !!!");

initApp(app)

//& Data Base Connection :
dbConnection() ;

export const server = app.listen(PORT , () => {
   //*------ Logs Here -------- :
   // logger.info(`✅ Server is running Successfully...`);
   console.log(`✅ Server is running ....`)
}) ;






//! Handle Error dbConnection And External Express => End the Code :
process.on("unhandledRejection" , (error)=>{
   console.log("❌ Error" , error);
});
