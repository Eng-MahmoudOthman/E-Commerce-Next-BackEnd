import coreJoi from "joi"; 
import JoiDate from '@joi/date'; 
const Joi = coreJoi.extend(JoiDate);


export const signUpVal = Joi.object({
   name: Joi.string().min(2).max(50).required().trim(),
   email: Joi.string().email().required().trim(),
   googleId: Joi.string() , 
   gender: Joi.alternatives().conditional("googleId", {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.string().valid('male', 'female').required(),
   }),
   phone: Joi.alternatives().conditional("googleId", {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/).trim().required(),
   }),
   birthDay: Joi.alternatives().conditional("googleId", {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.date().format('YYYY-MM-DD').required(),
   }),
   password: Joi.alternatives().conditional("googleId", {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.string()
         .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
         .required(),
   }),
   rePassword: Joi.alternatives().conditional("googleId", {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.valid(Joi.ref("password")).required(),
   }),
});


export const signInVal = Joi.object({
   userAccount:Joi.string().trim() ,
   password:Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required() ,
   rememberMe:Joi.boolean().default(false) ,
})




export const verifyOTPConfirmedEmailVal = Joi.object({
   OTP:Joi.string().min(6).max(6).required() 
})






export const paramsIdVal = Joi.object({
   id:Joi.string().hex().length(24).required() 
})




export const changePasswordVal = Joi.object({
   oldPassword:Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) ,
   
   password:Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) ,
   rePassword:Joi.valid(Joi.ref("password")) ,
})




export const sendCodeToEmailVal = Joi.object({
   email:Joi.string().email().required().trim() ,
})
export const verifyOTPVal = Joi.object({
   email:Joi.string().email().required().trim() ,
   OTP:Joi.string().length(6).pattern(/^[0-9]+$/).required() ,
})
export const resetPasswordVal = Joi.object({
   resetToken:Joi.string().length(20).pattern(/^[A-Za-z0-9]{20}$/).required() ,
	newPassword:Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required() ,
})
