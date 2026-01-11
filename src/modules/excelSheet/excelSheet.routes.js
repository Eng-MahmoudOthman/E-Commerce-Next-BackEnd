import { Router } from "express";
import {exportExcelSheet , getExcel, importExcelSheet } from "./excelSheet.controller.js";
import { singleVal } from "./excelSheet.validate.js";
import { validation } from "../../middleWare/validation.js";
import { multerLocal, validExtension } from "../../services/multer.Local.js";




const router  = Router() ; 


//^=========================== Import Excel Sheet ==============================================
router.route("/")
		.get (getExcel) 
		.post (multerLocal(validExtension.excel , "excel").single("file") ,  validation(singleVal) ,  importExcelSheet) 


		
//^=========================== Export Excel Sheet ==============================================
router.route("/downloadExcel")
		.get (exportExcelSheet) 

export default router ;



