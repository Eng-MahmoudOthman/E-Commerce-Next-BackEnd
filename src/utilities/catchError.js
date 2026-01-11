import { AppError } from "./AppError.js"


export function catchError (fn){

   return (req , res , next)=>{
      fn(req , res , next).catch((error)=>{
         const message = error.message || "Internal Server Error" ;
         next(new AppError(message , 500)) ;
         // next(error , 500) ;
      })
   }
   
}