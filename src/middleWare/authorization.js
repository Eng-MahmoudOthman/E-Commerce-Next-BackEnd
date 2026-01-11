import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";
import { logger } from "../utilities/logger.js";




//& Authorization :
export const authorize = (...roles)=>{
   return  catchError(
      async (req , res , next)=>{
         //^ Check Confirmed Account ----:
         if(!req.user.confirmedEmail){

            //*------ Logs Here -------- :
            logger.error(`Forbidden, Account Not Confirmed, Please Confirmed Email..! -  Name:${req.user.name} , id:${req.user._id}`);
            return next(new AppError("Forbidden, Account Not Confirmed, Please Confirmed Email.!" , 403)) ;
         }
         //^ Check User Role ----------- :
         const adminRole = roles.includes(req.user.role) ;
         if(!adminRole){

            //*------ Logs Here -------- :
            logger.warn(`Not Authorization Entered..! -  Name:${req.user.name} , Role:${req.user.role} , id:${req.user._id}`);
            return next(new AppError("Not Authorization Entered..!" , 403))
         } 
            
         next()
      }
   )
}


