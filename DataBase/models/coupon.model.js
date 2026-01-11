import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema({
   code:{
      type:String ,
      trim:true ,
      unique:[true , "Coupon Name is Unique"] ,
      required:[true , "Coupon Name is required"] ,
      minLength:[1 , "Should be More Than One Character"] ,
   } ,
   discountType: { 
      type: String, 
      enum: ["percentage", "fixed"], 
      required: true 
   },
   discountValue: { 
      type: Number, 
      required: true 
   } ,
   expired:{
      type:Date
   } ,
   createdBy:{
      type:Types.ObjectId , 
      ref:"user"
   }
} , { timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true} } )

schema.pre(/^find/ , function(){
   this.populate("createdBy" , "name")
})

export const couponModel = mongoose.model("coupon" , schema) ;

