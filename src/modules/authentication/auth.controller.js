import { userModel } from "../../../DataBase/models/user.model.js";
import { sendEmail } from "../../Emails/sendEmail.js";
import { AppError } from "../../utilities/AppError.js";
import { catchError } from "../../utilities/catchError.js";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { customAlphabet , nanoid} from 'nanoid' ;
import { getNextItemNumber } from "../../handlers/getNextItemNumber.js";
import { generateAccessToken, generateRefreshToken } from "../../handlers/generateToken.js";
import { sessionModel } from "../../../DataBase/models/session.model.js";
import { createSessionRefreshToken } from "../../handlers/createSession.js";
// import {logger} from "../../utilities/logger.js";

// logger.error("حصل خطأ في قاعدة البيانات");





const nanoID = customAlphabet('0123456789', 6) ;


const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 3 ;
const LOCK_TIME_MINUTES = parseInt(process.env.LOCK_TIME_MINUTES) || 5 ;
const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH ;
const NODE_ENV = process.env.NODE_ENV ;



//& Sign Up  :
   export const signUp = catchError(
      async (req , res , next)=>{
         const {name  , phone , birthDay , email ,  password , gender } = req.body ;

         
      //& Calculation Age From BirthDay :
         let age = 0 ;
         let nowAge = (birthDay)=>{
            let dateNow = new Date()
            let birth = new Date(birthDay)
            let diff = dateNow - birth
            let age = Math.floor(diff/1000/60/60/24/365);
            return age
         }
         age = nowAge(birthDay) ;

      //& Generate User Number :
         const itemNumber = await getNextItemNumber("user") ;

         const user = await userModel.create({itemNumber , name , age , gender , phone , birthDay , email  , password}) ;
         if(!user) return next(new AppError("User Not Added" , 404)) ;

         //*------ Logs Here -------- :
         // logger.info(`Registration is successfully Named: ${user._id , user.name}`);
         res.json({message:"success"})
      }
   ) ;


//& Sign In :
   export const signIn = catchError(
      async (req , res , next)=>{
         const{userAccount ,  password , rememberMe} = req.body ;

         const user = await userModel.findOne({$or:[{email : userAccount } , {phone : userAccount }]}) ;
         if(!user) return next(new AppError("User Not Exist" , 404)) ; 

         
         //& Check Blocked User Or Not :
         if(user.isBlocked) {

            //*------ Logs Here -------- :
            // logger.warn(`User is Blocked.! Named: ${user._id , user.name}`);
            return next(new AppError("Unauthorized, User Blocked..❌" , 401)) ;
         }
         
         // Protection From Many Wrong Password Entered :
         const isMatch  =  bcrypt.compareSync(password , user.password) ;
         if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
               user.lockUntil = Date.now() + LOCK_TIME_MINUTES * 60 * 1000;
               await user.save();

               //*------ Logs Here -------- :
               // logger.warn(`Too many attempts. Account locked.! -  Name:${user.name} , id:${user._id}`);
               return next(new AppError(`Too many attempts. Account locked for ${LOCK_TIME_MINUTES} minutes.`,403));
            }

            await user.save();

            //*------ Logs Here -------- :
            // logger.warn(`Invalid credentials, Email Or Password Incorrect.! Named: ${user._id , user.name}`);
            return next(new AppError("Invalid credentials, Email Or Password Incorrect", 401));
         }

         // Create Session :
         await createSessionRefreshToken(req , res , user , rememberMe) ;
         const loggedUser = await userModel.findById(user._id).select("-password -itemNumber -creationTimeAt") ;

         if(!user.confirmedEmail) {

            //*------ Logs Here -------- :
            // logger.error(`Forbidden, Account Not Confirmed.! -  Name:${user.name} , id:${user._id}`);
            return res.json({message:"Forbidden, Account Not Confirmed, Please Confirmed Email.!" , user:loggedUser })
         }

         //*------ Logs Here -------- :
         // logger.info(`Login User - Name:${loggedUser.name} , id:${loggedUser._id}`);
         res.json({message:"success" ,  user:loggedUser }) ;
      }
   ) ;


// //& Create Refresh Token And Access Token :
//    export const refreshAccessToken = catchError(
//       async (req, res, next) =>{
//          const refreshToken = req.cookies.refreshToken ;
//          const userAgent = req.headers["user-agent"] || "Unknown" ;
//          const sessionID =  nanoid() ;
//          const deviceIP =
//             req.headers["x-forwarded-for"]?.split(",")[0] ||      // لو السيرفر وراه Proxy
//             req.connection?.remoteAddress || 
//             req.socket?.remoteAddress ||
//             req.ip ;


//          if (!refreshToken){
//                //& Delete Cookies From Browser :
//                res.clearCookie("accessToken");
//                res.clearCookie("refreshToken");
//             return next(new AppError("Already logged out or session expired. , please login again" , 401)) ;
//          }


//          // ✅ دور على السيشن في DB
//          const session = await sessionModel.findOne({ refreshToken });
//          if (!session) return next(new AppError("Invalid Refresh Token" , 401)) ;


//          if (session.userAgent !== userAgent || session.deviceIP !== deviceIP) {
//             return next(new AppError("Device mismatch" , 403)) ;
//          }


//          try {
//             const decoded = jwt.verify(refreshToken , SECRET_KEY_REFRESH);
//             const user = await userModel.findById({_id : decoded.user}).select("-password -itemNumber -creationTimeAt") ;

//             // Create Refresh Token And Access Token :
//             const accessToken = generateAccessToken(res , user) ;

//             return res.json({message:"success" ,  user });
//          } catch (err) {
//             if(NODE_ENV === "development"){
//                console.log(err);
//             } ;

//             //& Delete All Old Session and Clear Cookies From Browser :
//             await sessionModel.deleteMany({ user: user._id });
//             res.clearCookie("accessToken");
//             res.clearCookie("refreshToken");

//             return next(new AppError("Expired or Invalid Refresh Token, So Session expired, please  Try login again" , 403)) ;
//          }
//       }
//    ) ;








// //& All Steps Change Password :
//    //^ Change Password :
//    export const changePassword = catchError(
//       async(req , res , next)=>{
//          const {password , rePassword , oldPassword} = req.body ;
//          const userAgent = req.headers["user-agent"] ;
//          const sessionID =  nanoid() ;
//          const deviceIP =
//             req.headers["x-forwarded-for"]?.split(",")[0] ||      // لو السيرفر وراه Proxy
//             req.connection?.remoteAddress || 
//             req.socket?.remoteAddress ||
//             req.ip ;
         

//          const user = await userModel.findById(req.user?._id) ;


//          //& Check User Old Password Correct or Not :
//          if(user && bcrypt.compareSync(oldPassword , user.password)) {
//             user.password = password ;
//             user.passwordChangedAt = Date.now() ;
//             await user.save() ;
//          }else{
//             return next(new AppError("Email Or Old Password InCorrect" , 404)) ;
//          }

//          //& Delete All Old Session :
//          await sessionModel.deleteMany({ user: user._id }); 


//          // Device Information Return in Request :
//          const device = {
//             user : user._id ,
//             userAgent ,
//             sessionID ,
//             deviceIP
//          }
         
//          // Create Refresh Token And Access Token :
//          const refreshToken = generateRefreshToken(res , device) ;
//          const accessToken = generateAccessToken(res , user) ;
         
//          // Create New Session :
//          await sessionModel.create({
//             user: user._id ,
//             refreshToken ,
//             sessionID ,
//             userAgent ,
//             deviceIP ,
//          });

//          const LoggedUser = await userModel.findById(user._id).select("-password -itemNumber -creationTimeAt") ;

//          //*------ Logs Here -------- :
//          // logger.info(`Change Password Successfully.! -  Name:${user.name}  , id:${user._id}`);
//          return res.json({message:"success" , user:LoggedUser})
//       }
//    ) ;





// //& All Steps Activated Account Email :
//    //^ Send Code :
//    export const sendCodeToEmailActivation = catchError(
//       async (req , res , next)=>{
//          const otp = nanoID() ;
//          const user = await userModel.findById(req.user._id)
//          if(!user) return next(new AppError("User Not Registration" , 401)) ; 

//          const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

//          user.otp_code = otp;
//          user.otpExpiry = expiry;
//          await user.save();

//          const subject =  "Activate Your Account for - Enter Company Name ✔" ;

//          let codeHtml = ()=>{
//             return `
//                <p style="font-size:16px; font-weight:bold;">Submit this activated code : <span style="display:inline-block ;  padding:2px; letter-spacing: 2px; color:white;  background-color:rgb(143,84,201) ;font-size:18px;">${otp}</span> If you did not request activated account, please ignore this email!</p>
//             `
//          }
//          await sendEmail(user.email , subject , codeHtml )

//          //*------ Logs Here -------- :
//          // logger.info(`Send OTP To Personal Email Successfully.! -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);
//          res.json({message:"Send OTP To Personal Email Successfully."})
//       }
//    ) ;
//    //^  Confirmed Email :
//    export const confirmedEmail = catchError(
//       async (req , res , next)=>{
//          const {OTP} = req.body ;

//          const user = await userModel.findById(req.user._id) ;

//          if (!user || user.otp_code !== OTP || user.otpExpiry < new Date()) return next(new AppError("Invalid or expired OTP , Please Enter Correct valid OTP !")) ; 

//       const updateUser =  await userModel.findByIdAndUpdate(user._id ,{
//             confirmedEmail:true ,
//             otp_code:null ,
//             otpExpiry:null ,
//          } , {new:true})

//          //*------ Logs Here -------- :
//          // logger.info(`Activated Account Successfully.! -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);
//          return res.json({message:"Activated Account Successfully" , user:updateUser}) ;
//       }
//    ) ;







// //& All Steps Forget Password :
//    //^ 1- Send Code To Email :
//    export const sendCodeToEmail = catchError(
//       async (req , res , next)=>{
//          const{email} = req.body ;

//          const otp = nanoID() ;
//          const user = await userModel.findOne({email})
//          if(!user) return next(new AppError("User Not Registration")) ; 



//          const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

//          user.otp_code = otp;
//          user.otpExpiry = expiry;
//          await user.save();

//          let codeHtml = ()=>{
//             return `
//                <p style="font-size:16px; font-weight:bold;">Submit this reset password code : <span style="display:inline-block ;  padding:2px; letter-spacing: 2px; color:white;  background-color:rgb(143,84,201) ;font-size:18px;">${otp}</span> If you did not request a change of password, please ignore this email!</p>
//             `
//          }
//          const subject =  "Your Password Reset Code (valid for 10 minutes) To reset your password."
//          sendEmail(user.email , subject , codeHtml ) ;

//          //*------ Logs Here -------- :
//          // logger.info(`OTP sent to your Email Successfully.! -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);
//          res.json({ message: "OTP sent to your email" });

//       }
//    ) ;
//    //^ 2- Verify OTP  :
//    export const verifyOTP = catchError(
//       async (req , res , next)=>{
//          const{email , OTP} = req.body ;

//          const user = await userModel.findOne({email})

//          if (!user || user.otp_code !== OTP || user.otpExpiry < new Date()) return next(new AppError("Invalid or expired OTP , Please Enter Correct valid OTP !")) ; 

//          const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' , 20);

//          const resetToken = nanoid();
//          const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 دقيقة صلاحية

//          user.resetToken = resetToken;
//          user.resetTokenExpiry = expiry;
//          user.otp_code = null;
//          user.otpExpiry = null;
//          await user.save();

//          //*------ Logs Here -------- :
//          // logger.info(`OTP Verified Successfully.! -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);
//          res.json({message:"OTP Verified Successfully" , resetToken})
//       }
//    ) ;
//    //^ 3- Reset New Password :
//    export const resetPassword = catchError(
//       async (req , res , next)=>{
//          const { resetToken , newPassword } = req.body;
//          const user = await userModel.findOne({
//             resetToken,
//             resetTokenExpiry: { $gt: new Date() },
//          });

//          if(!user) return next(new AppError("Invalid or expired token")) ; 

//          user.password = newPassword;
//          user.resetToken = null;
//          user.resetTokenExpiry = null;
//          user.passwordChangedAt = Date.now() ;
//          await user.save()

//          let codeHtml = ()=>{
//             return `
//                <p style="font-size:16px; font-weight:bold;">The new forgotten password has been changed. Please don't share this information with anyone and try again login now ! <span style="display:inline-block ;  padding:2px; letter-spacing: 2px; color:white;  background-color:rgb(143,84,201) ;font-size:18px;">${newPassword}</span> If you did not request a change of password, please ignore this email!</p>
//             `
//          } ;

//          const subject =  "Your password has been changed. Please do not share this information"
//          sendEmail(user.email , subject , codeHtml ) ;

//          //*------ Logs Here ------  :
//          // logger.info(`Reset Password Successfully.! -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);

//          res.json({message:"Reset Password successfully" , newPassword }) ;
//       }
//    ) ;






// //& Login With Google Account :
//    export const loginWithGoogle = catchError(
//       async (req , res , next) => {
//          const email = req.user.emails[0].value ;
//          const emailVerified = req.user.emails[0].verified ;
//          const userAgent = req.headers["user-agent"] ;
//          const sessionID =  nanoid() ;
//          const deviceIP =
//             req.headers["x-forwarded-for"]?.split(",")[0] ||      // لو السيرفر وراه Proxy
//             req.connection?.remoteAddress || 
//             req.socket?.remoteAddress ||
//             req.ip ;
         
//          let user = await userModel.findOne({email} ) ;
//          if(!user) return next(new AppError("User Not Exist..❌" , 404)) ;
         
//          //& Check Blocked User Or Not :
//          if(user.isBlocked){ 

//             //*------ Logs Here -------- :
//             // logger.info(`Unauthorized Logged By Google, User Blocked..❌ -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);
//             return next(new AppError("Unauthorized, User Blocked..❌" , 401)) ;
//          }

//          if(!user){
//             user = await userModel.create({
//                name:req.user.displayName ,
//                googleId:req.user.id ,
//                email ,
//                confirmedEmail:emailVerified ,
//                isCompleteProfile: false
//             })
//          }else {
//             user.googleId = req.user.id ;
//             user.confirmedEmail = emailVerified ;
//             await user.save() ;
//          }


//          // Device Information Return in Request :
//          const device = {
//             user :user._id ,
//             userAgent ,
//             sessionID ,
//             deviceIP 
//          }


//          // Create Refresh Token And Access Token :
//          const refreshToken = generateRefreshToken(res , device) ;
//          const accessToken = generateAccessToken(res , user) ;


//          // Delete Any Session To This Device :
//          await sessionModel.findOneAndDelete({user: user._id, deviceIP, userAgent}) ;

//          // Create Session :
//          await sessionModel.create({
//             user : user._id ,
//             refreshToken : refreshToken.token ,
//             userAgent ,
//             sessionID ,
//             deviceIP 
//          }) ;

//          //*------ Logs Here -------- :
//          // logger.info(`Login Google Successfully.! -  Name:${user.name} , Email:${user.email}  , id:${user._id}`);
//          res.redirect(`${process.env.REDIRECT_URL_GOOGLE}/#/user/LoginSuccessGoogle`);
//       }
//    ) ;





//& Log Out From One Device :
   export const logOut = async (req, res, next) => {
      const refreshToken = req.cookies.refreshToken ;
      if (!refreshToken) return next(new AppError("Refresh Token is Required" , 404)) ;

      await sessionModel.findOneAndDelete({ refreshToken });
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");

      //*------ Logs Here -------- :
      // logger.info(`Logged Out Successfully.! -  Name:${req.user.name} , Email:${req.user.email}  , id:${req.user._id}`);
      res.json({ message: "Logged out successfully" });
   } ;




// //& Log Out From All Devices :
//    export const logOutAllDevices = async (req, res, next) => {
//       await sessionModel.deleteMany({ user: req.user._id });

//       res.clearCookie("refreshToken");
//       res.clearCookie("accessToken");

//       //*------ Logs Here -------- :
//       // logger.info(`Logged out from all devices Successfully.! -  Name:${req.user.name} , Email:${req.user.email}  , id:${req.user._id}`);
//       res.json({ message: "Logged out successfully from all devices" });
//    } ;