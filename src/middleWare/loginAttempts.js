import { userModel } from "../../DataBase/models/user.model.js";
import { AppError } from "../utilities/AppError.js";
// import { logger } from "../utilities/logger.js";






// Protection From Many Wrong Password Entered :
export const checkLoginAttempts = async (req, res, next) => {
   const { userAccount } = req.body;

   const user = await userModel.findOne({
      $or:[
         {email : userAccount } , 
         {phone : userAccount }
      ]
   }) ;
   if(!user) return next(new AppError("User Not Exist" , 404)) ; 


   // Account is Locked and Not Expired Time :
   if (user.lockUntil && user.lockUntil > Date.now()) {

      //*------ Logs Here -------- :
      // logger.warn(`Too many attempts. Account locked.! -  Name:${user.name} , id:${user._id}`);
      return next(new AppError("Account locked. Try again later after 5 minutes .!", 403));
   }

   // Block End :
   if (user.lockUntil && user.lockUntil < Date.now()) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
   }

   req.user = user;
   next();
};
