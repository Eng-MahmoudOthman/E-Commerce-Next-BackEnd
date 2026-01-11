import coreJoi from "joi"; 
import JoiDate from '@joi/date'; 
const Joi = coreJoi.extend(JoiDate);

const uploadImageSize = Number(process.env.UPLOAD_IMAGE_SIZE) || 2000000 ;

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
export const singleVal = {
	file:generalFields.file.required() ,
}







export const createCashOrderVal = Joi.object({
	name:Joi.string().min(2).max(50).trim().required() ,
   phone:Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/).trim().required() ,
   gender:Joi.string().required() ,
   city:Joi.string().required() ,
   street:Joi.string().required() ,
})


export const createOnlineOrderVal = Joi.object({
	name:Joi.string().min(2).max(50).trim().required() ,
   phone:Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/).trim().required() ,
   gender:Joi.string().required() ,
   payment_method_id:Joi.number().required() ,
   city:Joi.string().required() ,
   street:Joi.string().required() ,
})



export const paramsIdVal = Joi.object({
	id:Joi.string().hex().length(24).required() 
})

