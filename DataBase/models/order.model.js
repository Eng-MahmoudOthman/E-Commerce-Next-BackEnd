import { Schema, Types, model } from "mongoose";


const schema = new Schema({
   itemNumber:{
      type:String ,
      unique:[true , "Order Order Number is Unique"]
   } , 
   user:{
      type:Types.ObjectId ,
      ref: "user" 
   } ,
   name :{
      type:String ,
      required:true
   } , 
   phone :{
      type:String ,
      required:true ,
      match: [/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"]
   } , 
   address:{
      city:{
         type:String ,
      } ,
      street:{
         type:String ,
      } ,
   } ,
   gender:{
      type:String ,
      enum :["male" , "female"] ,
      default:"male"
   } ,
   invoice:String ,
   invoice_number:{
      type:Number ,
      required:true
   } ,
   invoiceExpiryDate: Date ,
   orderItems:[
      {
         product:{
            type:Types.ObjectId , 
            ref:"product"  ,
         } ,
         quantity: {
            type:Number ,
         },
         price:{
            type:Number
         }  ,
         priceAfterDiscount:{
            type:Number
         }  ,
         contractPrice:{
            type:Number
         }  ,
      }
   ] ,
   message:{
      type:String ,
      default:"No Message" ,
   } ,
   paymentType:{
      type:String ,
      enum:["cash" , "card" , "instaPay"] ,
      default:"card" ,
   } ,
   totalPrice:{
      type:Number ,
      default: 0 ,
   } ,
   totalPriceAfterDiscount:{
      type:Number ,
      default: 0 ,
   } ,
   totalNetAmount:{
      type:Number ,
      default: 0 ,
   } ,
   totalContractPrice:{
      type:Number ,
      default: 0 ,
   } ,
   status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled" , "approved"],
      default: "pending"
   },
   approvedAt:Date ,
   paidAt: Date,
   shippedAt: Date,
   completedAt: Date,
   cancelledAt: Date ,
   coupon: {
      code: { 
         type: String, 
      },
      discountType: { 
         type: String , 
         enum: ["percentage", "fixed"] , 
      },
      discountValue: { 
         type: Number , 
      } ,
      expired:{
         type:Date
      } ,
   } ,
   creationTimeAt:{
      type:Number ,
      index:true
   }  ,
} , { timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true} } ) ;



//& Added Dynamic Creation Time At :
schema.pre("save"  , function(next){   
   if (!this.creationTimeAt) {
      this.creationTimeAt = Date.now() ;
   }

   if (!this.invoiceExpiryDate) {
      const expiry = new Date(this.createdAt || Date.now());
      expiry.setDate(expiry.getDate() + 30);
      this.invoiceExpiryDate = expiry;
   }
   next()
}) ;


schema.pre(/^find/ , function(next){
   this.populate({
      path:"orderItems" , 
      populate :{
         path:"product" , 
         model:"product"
      } 
   })

     next(); // ← لازم
}) ;

schema.pre("init" , function (doc){
   doc.invoice = process.env.BASE_URL + "/pdf/" +  doc.invoice
}) ;

export const orderModel = model("order" , schema) ;
