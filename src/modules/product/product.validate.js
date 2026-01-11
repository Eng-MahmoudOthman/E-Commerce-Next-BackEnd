import Joi from "joi" ;



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



export const paramVal = Joi.object({
   id:Joi.string().hex().length(24).required() ,
})






// -===================================================
export const addProductVal = Joi.object({
   title:Joi.string().min(2).max(200).trim().required() ,
   description:Joi.string().min(10).max(1500).trim().required() ,
   price:Joi.number().min(0).required() ,
   priceAfterDiscount:Joi.number().min(0).required() ,
   contractPrice:Joi.number().min(0).required() ,
   quantity:Joi.number().min(0).optional() ,
   files:Joi.array().items(generalFields.file).max(10).required()   
})