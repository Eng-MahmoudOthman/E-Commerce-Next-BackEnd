

import multer from "multer"
import { AppError } from "../utilities/AppError.js"
import { logger } from "../utilities/logger.js"


const multerCloudinary = ()=>{
   const storage = multer.diskStorage({})
   const fileFilter = function (req , file , cb){

      
      // if(file.mimetype.startsWith("application")){
         
      if(file.mimetype.startsWith("image")){
         cb(null , true)
      }else{
         cb(new AppError("Invalid Type Media" , 404) , false)
      }
   }
   
   const upload = multer({ storage: storage  , fileFilter:fileFilter})
   return upload;
}








export const uploadSingleFile = (fieldName)=>{
   return multerCloudinary().single(fieldName) ;
}


export const uploadArrayOfFiles = (fieldName)=>{
   return multerCloudinary().array(fieldName , 10) ;
}


export const uploadFields = (fields)=>{
   return multerCloudinary().fields(fields) ;
}











