import Joi from "joi" ;

export const addCartVal = Joi.object({
   product:Joi.string().hex().length(24).required() ,
   quantity:Joi.number().integer().options({convert:false})
})


export const applyCouponVal = Joi.object({
   coupon:Joi.string().required() 
})




