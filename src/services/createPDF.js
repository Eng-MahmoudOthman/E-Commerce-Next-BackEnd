import puppeteer from 'puppeteer';
import { generateDate } from './generateDateTime.js';
import fs from 'fs';
import path from 'path';
import { logger } from '../utilities/logger.js';


const date = generateDate();

export let createPDF = async (template , data , fileName) => {

   //! Check Exist Docs Folder And Create Folder Docs When Not Exist :
   const destPath = path.resolve(`Docs/`) ;
   if(!fs.existsSync(destPath)){
      fs.mkdirSync( destPath , {recursive:true})
   }



   let fullName = `${fileName}.pdf`;
   // const browser = await puppeteer.launch();
   const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
   });


   const page = await browser.newPage();

   //! Generate the HTML content from the template and data
   const content = template(data);

   //! Set up the page content
   // await page.setContent(content);
   await page.setContent(content, { waitUntil: 'networkidle0' });


   //! PDF options
   const options = {
      path: `./Docs/${fullName}`,
      format: 'A4',
      printBackground: true,
      margin: {
         top: '10px',
         bottom: '30px',
         left: '10px',
         right: '10px',
      } ,
      displayHeaderFooter: true,
      headerTemplate: `<div style="text-align: center; color:blue;">Email: info@sm-trend.com </div>`,
      footerTemplate: `
         <div style="text-align: center; color: #444;">
            ${date} | Page <span class="pageNumber"></span> of <span class="totalPages"></span>
         </div>
      `,
   };

   //! Create the PDF
   await page.pdf(options);

   //! Close the browser
   await browser.close();

   let filePath = `${process.env.BASE_URL}/pdf/${fullName}`; 


   //*------ Logs Here -------- :
   logger.info(`✅ Create PDF File Name [${filePath}] Successfully...`);
   return filePath;
};
