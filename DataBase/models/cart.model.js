import { Schema, Types, model } from "mongoose";




const schema = new Schema({
   user:{
      type:Types.ObjectId , 
      ref:"user"  ,
      unique:true
   } ,
   cartItems:[
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
   coupon:{
      type:Types.ObjectId , 
      ref:"coupon"  ,
   } ,
   creationTimeAt:{
      type:Number 
   } 
} , { timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true} } )


//& Added Dynamic Creation Time At :
schema.pre("save"  , function(next){   
   if (!this.creationTimeAt) {
      this.creationTimeAt = Date.now() ;
   }
   next()
}) ;


schema.pre(/^find/ , function(next){
   this.populate("user coupon" , "name code discountType discountValue expired")
   next()
}) ;



//& Calculate Total Price  : 
schema.virtual("totalPrice").get(function (){
   const total = this.cartItems.reduce((acc , entry)=>{
      return (acc + entry.price) * entry.quantity
   } , 0)
   return Math.round(total)
})



//& Calculate total price after discount, Coupon discount : 
schema.virtual("totalPriceAfterDiscount").get(function (){
   const total = this.cartItems.reduce((acc , entry)=>{
      return (acc + entry.priceAfterDiscount) * entry.quantity
   } , 0)

   // Apply Coupon :
   let finalPrice = total;
   if (this.coupon) {
      // خصم سواء نسبة أو قيمة ثابتة
      if (this.coupon.discountType === "percentage") {
         finalPrice = total - (total * this.coupon.discountValue / 100);
      } else if (this.coupon.discountType === "fixed") {
         finalPrice = total - this.coupon.discountValue;
      }
   }

   return Math.round(finalPrice)
})



//& Calculate total contract price  : 
schema.virtual("totalContractPrice").get(function (){
   const total = this.cartItems.reduce((acc , entry)=>{
      return (acc + entry.contractPrice) * entry.quantity
   } , 0)
   return Math.round(total)
})



export const cartModel = model("cart" , schema)
