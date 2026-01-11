import coreJoi from "joi"; 
import JoiDate from '@joi/date'; 
const Joi = coreJoi.extend(JoiDate);

const uploadImageSize = Number(process.env.UPLOAD_IMAGE_SIZE) || 2000000;

export const generalFields = {
	file:Joi.object({
		size:Joi.number().positive().max(uploadImageSize),
		path:Joi.string(),
		filename:Joi.string(),
		destination:Joi.string(),
		mimetype:Joi.string(),
		encoding:Joi.string(),
		originalname:Joi.string(),
		fieldname:Joi.string(),
		finalDest:Joi.string()
	})
}



export const singleVal = Joi.object({
   file:generalFields.file.required() ,
})


export const addUserVal = Joi.object({
   name:Joi.string().min(2).max(50).required().trim() ,
   phone:Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/).required().trim() ,
   birthDay:Joi.date().format('YYYY-MM-DD') , 
   role:Joi.string().valid("user" , "admin" , "moderator").required() ,
   email:Joi.string().email().required().trim() ,
   gender: Joi.string().valid('male', 'female') ,
   password:Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required() ,
   rePassword:Joi.valid(Joi.ref("password")).required()
})

export const updateUserRoleVal = Joi.object({
   id:Joi.string().hex().length(24).required() ,
   
   role:Joi.string().valid("user" , "admin" , "moderator").required() ,
})







export const paramsIdVal = Joi.object({
   id:Joi.string().hex().length(24).required() 
})



export const blockedAndActiveUserVal = Joi.object({
   id:Joi.string().hex().length(24).required() ,
   block:Joi.boolean().optional(),
})




export const updateUserVal = Joi.object({
   name:Joi.string().min(2).max(50).trim() ,
   phone:Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/).required().trim() ,
   birthDay:Joi.date().format('YYYY-MM-DD') , 
   gender: Joi.string().valid('male', 'female') ,
   email:Joi.string().email().trim() ,
})



export const SettingProfileVal = Joi.object({
   color:Joi.string().min(2).max(15).trim() ,
   fontSize:Joi.number().min(5).max(100) 
})





export const completeUserInfoWhenLoginGoogleVal = Joi.object({
   phone:Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/).required().trim() ,
   birthDay:Joi.date().format('YYYY-MM-DD') , 
   gender: Joi.string().valid('male', 'female') ,
   password:Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required() ,
   rePassword:Joi.valid(Joi.ref("password")).required()
})