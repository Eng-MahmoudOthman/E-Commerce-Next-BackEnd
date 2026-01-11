import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";




//& Authorization :
export const authorize = (...roles)=>{
   return  catchError(
      async (req , res , next)=>{
         //^ Check Confirmed Account ----:
         if(!req.user.confirmedEmail){

            //*------ Logs Here -------- :
            return next(new AppError("Forbidden, Account Not Confirmed, Please Confirmed Email.!" , 403)) ;
         }
         //^ Check User Role ----------- :
         const adminRole = roles.includes(req.user.role) ;
         if(!adminRole){

            //*------ Logs Here -------- :
            return next(new AppError("Not Authorization Entered..!" , 403))
         } 
            
         next()
      }
   )
}


