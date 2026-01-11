import { excelModel } from "../../../DataBase/models/excel.model.js";
import { orderModel } from "../../../DataBase/models/order.model.js";
import {exportDataToExcelWithoutId} from "../../services/exportExcel.js";
import { importExcelData } from "../../services/importExcel.js";
import { AppError } from "../../utilities/AppError.js";
import { catchError } from "../../utilities/catchError.js"


const uploadImageSize = Number(process.env.UPLOAD_IMAGE_SIZE) || 2000000;




//& Add Excel :
export const getExcel = catchError(
   async(req , res , next)=>{

      const excel = await excelModel.find();
      res.json({message:"success" , excel})
   }
) ;








//& Add Excel :
export const importExcelSheet = catchError(
   async(req , res , next)=>{
      if(!req.file) return next(new AppError("Please Choose Excel Sheet" , 404))

      if((req.file.size > uploadImageSize)){
         return next(new AppError("Size Media Should be Less than 200 k-Byte" , 404))
      }

      const excelPath = req.file.path ;
      
      const data = await importExcelData(excelPath) ;
      await excelModel.insertMany(data) ;
      res.json({message:"success" , excelPath})

   }
) ;

//& Create Excel :
export const exportExcelSheet = catchError(async (req, res, next) => {
   const data = await excelModel.find().select("-_id name age");
   const plainData = data.map(doc => doc.toObject());

   const filePath = await exportDataToExcelWithoutId(plainData);

   if (filePath) {
      res.download(filePath, 'data.xlsx', (err) => {
         if (err) {
            console.error('❌ Error downloading file:', err);
            return next(AppError('Error downloading file', 500));
         }
      });
   } else {
      return next(AppError('No data to export', 404));
   }
});

