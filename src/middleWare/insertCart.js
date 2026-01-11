import { cartModel } from "../../DataBase/models/cart.model.js";
import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";
import { logger } from "../utilities/logger.js";





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
         logger.info(`Insert Cart Successfully.! -  Name:${req.user.name}  , CartId:${cart._id} , id:${req.user._id}`);
      }
      req.cart = cart ;
      next() ;
   }
)