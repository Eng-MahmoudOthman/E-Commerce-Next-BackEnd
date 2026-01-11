
import xlsx from "xlsx" ;
import { logger } from "../utilities/logger.js";



export const importExcelData = async (filePath) => {
   try {
      const workbook = xlsx.readFile(filePath) ;
      const sheetName = workbook.SheetNames[0] ;
      const worksheet = workbook.Sheets[sheetName] ;
      const data = xlsx.utils.sheet_to_json(worksheet) ;

      console.log('📥 Excel data imported successfully.') ;

      //*------ Logs Here -------- :
      logger.info(`📥 Excel data imported successfully.`);

      return data ;
   } catch (error) {

      //*------ Logs Here -------- :
      logger.error(`⚠️ Error importing Excel data!!`);

      console.error('⚠️ Error importing Excel data:', error) ;
   }
};

