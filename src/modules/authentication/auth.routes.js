import { Router } from "express";
import * as AuthControl from "./auth.controller.js";
import { accountExist } from "../../middleWare/accountExist.js";
import {signUpVal ,  signInVal , changePasswordVal , sendCodeToEmailVal , resetPasswordVal, verifyOTPVal, verifyOTPConfirmedEmailVal} from "../authentication/auth.validate.js";

import { protectedRoutes } from "../../middleWare/authentication.js";
import { authorize } from "../../middleWare/authorization.js";
import { validation } from "../../middleWare/validation.js";
import { ROLES } from "../../utilities/enums.js";
import env from "dotenv" ;
import { checkLoginAttempts } from "../../middleWare/loginAttempts.js";
import passport from 'passport';

env.config();


const router  = Router() ; 
//^=========================== Sign Up =============================================
	router.route("/register")
		.post (validation(signUpVal) ,  accountExist  , AuthControl.signUp) 




//^=========================== Log in ==============================================
	router.route("/login")
		.post(validation(signInVal) , checkLoginAttempts , AuthControl.signIn) 


//^=========================== Log Out =============================================
	router.route("/logOut")
		.patch(protectedRoutes , AuthControl.logOut) 


//^=========================== Sign In =============================================
	router.route("/logOutAllDevices")
		.patch(protectedRoutes , AuthControl.logOutAllDevices) 




		
		
		
	//^=========================== Refresh Token ======================================
	router.route("/refresh-Token")
		.post(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , AuthControl.refreshAccessToken) 
		
		
		
	//^=========================== Change Password =====================================
	router.route("/changePassword")
		.patch(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , validation(changePasswordVal) , AuthControl.changePassword) 
		
		
		
		
//^=========================== Confirmed Email =====================================

	//^ 1- First request to send OTP :
	router.route("/send-otp")
		.post(protectedRoutes ,  AuthControl.sendCodeToEmailActivation) 
	//^ 1- Verify OTP and confirmed account :
	router.route("/confirm")
		.post(protectedRoutes , validation(verifyOTPConfirmedEmailVal)   , AuthControl.confirmedEmail) 
	




//^=========================== All Steps Forget Password =========================== 
router.route("/request-reset")
//^ 1- Send Code BY Email :
.post(validation(sendCodeToEmailVal)  , AuthControl.sendCodeToEmail) 
//^ 2- Send Code BY Email :
router.route("/verify-otp")
.post(validation(verifyOTPVal) , AuthControl.verifyOTP) 
router.route("/reset-password")
//^ 3- Reset Password :
.post(validation(resetPasswordVal)   , AuthControl.resetPassword) 


//^=========================== All Steps Forget Password =========================== 
	router.route('/google')
		.get(passport.authenticate('google', { scope: ['profile', 'email']  , session: false }));
	router.route('/google/callback')
      .get(passport.authenticate('google', { failureRedirect: '/' ,  session: false }), AuthControl.loginWithGoogle) ;

export default router ;