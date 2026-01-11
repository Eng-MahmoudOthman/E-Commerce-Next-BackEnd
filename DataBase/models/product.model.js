import { Schema, Types, model } from "mongoose";


const schema = new Schema({
   title:{
      type:String , 
      trim : true ,
      required:[true , "Product Title is required"] ,
      unique:[true , "Product Title is Unique"] ,
      lowercase:true ,
      minLength:[1 , "Should be Character Count More Than 2 Character"] ,
      maxLength:[300 , "Should be Character Count Less Than 300 Character"] ,
   } ,
   slug:{
      type:String ,
      lowercase:true ,
      required:[true , "Slug is required"] ,
      unique:[true , "Product Title is Unique"] ,
   } ,
   image:{
      type:String
   } ,
   images:[{
      type:String ,
   }] ,
   description:{
      type:String ,
      minLength:[10 , " More than 10 Character"] ,
      maxLength:[1500 , " Less than 500 Character"] ,
      required:[true , " description is required"]
   } ,
   isActive:{
      type:Boolean ,
      default:true
   } , 
   price:{
      type:Number ,
      required:[true , "Price is required"]
   } ,
   priceAfterDiscount:{
      type:Number ,
      required:[true , "Price After Discount is required"]
   } ,
   contractPrice:{
      type:Number
   }  ,
   quantity:{
      type:Number ,
      default:0 ,
   } ,
   sold:{
      type:Number ,
      default:0 ,
   } ,
   rateCount:{
      type:Number ,
      default: 0 ,
   } ,
   rateAvg:{
      type:Number ,
      default: 0 ,
   } ,
   createdBy:{
      type:Types.ObjectId , 
      ref:"user"
   } ,
   creationTimeAt:{
      type:Number ,
      index:true
   } ,
} , { timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true} } )



//& Added Dynamic Creation Time At :
schema.pre("save"  , function(next){   
   if (!this.creationTimeAt) {
      this.creationTimeAt = Date.now() ;
   }
   next()
}) ; 


schema.post("init" , function(doc){
   if(doc.image) {
      doc.image = `${process.env.BASE_URL}/products/${doc.image}`;
   }
   
   if(doc.images) {
      doc.images = doc.images.map((ele)=>{
         return ele = `${process.env.BASE_URL}/products/${ele}`;
      })
   }
})


schema.pre("find" , function(){
   this.populate("createdBy" , "_id name")
})


export const productModel = model("product" , schema)






