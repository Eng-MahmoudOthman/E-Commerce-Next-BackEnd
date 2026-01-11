import { userModel } from "../../DataBase/models/user.model.js";
import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";


export const accountExist = catchError(
   async(req , res , next)=>{
      const user = await userModel.findOne({$or:[
         {email:req.body.email} ,
         {phone:req.body.phone} ,
      ]}) ;
      if(user) return next(new AppError("Conflict, User Already Exist..!" , 409)) ;
      next() ;
   }
)