import { userModel } from "../../DataBase/models/user.model.js";
import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";
import jwt from "jsonwebtoken";
import { logger } from "../utilities/logger.js";



//& Authentication :
export const protectedRoutes = catchError(
   async (req , res , next)=>{
      const token = req.cookies.accessToken ;

      //& 1- Check Token Exist And Bearer Token :
      if (!token){

         //*------ Logs Here -------- :
         logger.error(`Token Not Exist, Unauthorized!`);
         return next(new AppError("Token Not Exist, Unauthorized!" , 401)) ;
      }

      //& 2- verify Token
      try {
         let decoded = jwt.verify(token , process.env.SECRET_KEY_ACCESS) ;
         if(!decoded) return next(new AppError("Token Not Valid" , 498)) ;
         
         //& 3- Check Exist User Or Not :
         const user = await userModel.findById(decoded._id).select("-password") ;
         if(!user) return next(new AppError("User Not Exist ProtectedRoute" , 401)) ;


         //& 4- Check Blocked User Or Not :
         if(user.isBlocked){

            //*------ Logs Here -------- :
            logger.error(`Unauthorized, User Blocked..❌-  Name:${user.name} , id:${user._id}`);
            return next(new AppError("Unauthorized, User Blocked..❌" , 401)) ;
         }
         
         //& 5- Change Password And Token Expired
         if(user.passwordChangedAt){
            const passwordChangedTime = Math.floor(user.passwordChangedAt.getTime() / 1000);
            if(passwordChangedTime > decoded.iat) return next(new AppError("Token Not Valid..Login again" , 401)) ;
         }

         req.user = user
         next();
      } catch (error) {
         let message = "Authentication Failed, Token Not Valid.!";
         if (error.message === "jwt malformed") {
            message = "Invalid Token Format.!";
         } else if (error.message === "jwt expired") {
            message = "Token Expired, please login again.!";
         } else if (error.message === "invalid signature") {
            message = "Invalid Token Signature.!";
         } else if (error.message === "jwt not active") {
            message = "Token Not Active Yet.!";
         }
         return next(new AppError(message, 498));
      }
   }
)

