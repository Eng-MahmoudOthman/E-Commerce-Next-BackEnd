import { cartModel } from "../../DataBase/models/cart.model.js";
import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";





export const insertCart = catchError(
   async(req , res , next)=>{
      let cart = await cartModel.findOne({user:req.user._id}) ;

      if(!cart){
         cart = new cartModel({
            user:req.user._id ,
            cartItems:[] ,
         });
         await cart.save() ;

         //*------ Logs Here -------- :
      }
      req.cart = cart ;
      next() ;
   }
)