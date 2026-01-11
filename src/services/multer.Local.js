import {customAlphabet} from "nanoid";
import fs from "fs";
import path from "path";
import multer from "multer";
import { AppError } from "../utilities/AppError.js";
import { logger } from "../utilities/logger.js";

const uniqueNumber = customAlphabet("123456789" , 5)


export let validExtension = {
   image:["image/jpeg" , "image/png" , "image/webp" , "image.jpg"] , 
   audio:["audio/x-ms-wma" , "audio/mp4"] ,
   pdf:["application/pdf"] ,
   excel:[ 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}


export const multerLocal = (validationType , folderName)=>{

   //& Check folder exist or create new folder sane name  :
   const destPath = path.resolve(`Uploads/${folderName}`)
   if(!fs.existsSync(destPath)){
      fs.mkdirSync( destPath , {recursive:true})
   }



   //& Check Array into Extension Types Is Present Or Not And Setting Default Types :
   if(!validationType){
      validationType = validExtension.image
   }


   const storage = multer.diskStorage({
      destination : function (req , file ,cb){
         cb(null , destPath)
      } ,
      filename : function (req , file ,cb){
         //& Use nanoid Module Production Only Number Random + Name File :
         const uniqueName = uniqueNumber() + file.originalname 
         cb(null , uniqueName);

         //& Use nanoid Module Production (Number And Character) Random + Name File :
         // const uniqueName = nanoid(5) + file.originalname 
         // cb(null , uniqueName);

         //& Use J.S Native Production Number Random + Name File :
         // const uniqueName = Date.now() + "_" + Math.round(Math.random()* 1E5) ;
         // cb(null , uniqueName + "_" + file.originalname);
      }
   })

   const fileFilter = function(req , file , cb) {
      if( validationType.includes(file.mimetype)){
         return cb(null , true)
      }else{
         console.log(file.mimetype);
         return cb(new AppError("invalid Media Type" , 404) , false)
      }
   }


   const upload = multer({fileFilter , storage}) ;
   return upload ; 
}

