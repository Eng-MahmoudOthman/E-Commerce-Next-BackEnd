
import path from "path";
import fs from "fs";
import XLSX  from "xlsx" ;
import ExcelJS from 'exceljs';
// import { logger } from "../utilities/logger.js";


// ! Not Appear id Into Object in Excel Sheet :
export const exportDataToExcelWithoutId =  async(data) =>{

   if (data && data.length > 0) {
      // تحويل البيانات إلى ورقة Excel
      const worksheet =  XLSX.utils.json_to_sheet(data);

      // إنشاء ملف Excel
      const workbook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
         
         // حفظ الملف على الجهاز
         const filePath = path.resolve('Uploads/excel/data.xlsx');
         if (!fs.existsSync(filePath)) {
               fs.mkdirSync(filePath, { recursive: true });
            }
            XLSX.writeFile(workbook , filePath);         
         console.log('Data exported to Excel successfully!');

         //*------ Logs Here -------- :
         // logger.info(`Data exported to Excel Successfully!'`);

      return filePath ; // إرجاع المسار الكامل للملف
   } else {

         //*------ Logs Here -------- :
         // logger.error(`No data to export Excel !!`);
      console.log('No data to export.');
   }
}






// ! Appear id Into Object in Excel Sheet :
export const exportDataToExcelWithinId = async (data) => {
   if (!data || data.length === 0) {
      console.log('🚫 No data to export.');
      return null;
   }

   // إنشاء ملف Excel جديد وورقة بيانات
   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet('Sheet1');

   // تعيين الأعمدة بناءً على مفاتيح أول عنصر
   worksheet.columns = Object.keys(data[0]).map(key => ({
      header: key,
      key: key,
      width: 20
   }));

   // (id) إضافة الصفوف وحزف علامة التنصيص فى اى دى
   data.forEach(item =>{
      item._id = item._id.toString() ;
      worksheet.addRow(item) ;
   });

   // تحضير المسار
   const dirPath = path.resolve('Uploads/excel');
   if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
   }

   const filePath = path.join(dirPath, `data-${Date.now()}.xlsx`);
   await workbook.xlsx.writeFile(filePath);

   console.log('✅ Excel file created at:', filePath);
   return filePath;
};
