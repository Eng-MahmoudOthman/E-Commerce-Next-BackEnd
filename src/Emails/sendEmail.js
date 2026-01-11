
import { createTransport } from "nodemailer";
import path from "path";




export const sendEmail = async (sendTo ,  subject , content , files=[])=>{
   const transporter = createTransport({
      secure: true,
      service:"gmail" ,
      auth: {
         user: process.env.EMAIL_SENDING_MESSAGE,
         pass: process.env.EMAIL_PASSWORD,
      },


      // host: "smtp.forwardemail.net",
      // port: 465,
      // secure: true,
      // auth: {
      //    user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      //    pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
      // },
   });


      const attachments = files.map(filePath => ({
         filename: path.basename(filePath),
         path: filePath,
      }));
   
   //! send mail with defined transport object
   const info = await transporter.sendMail({
      from: `"ENTER COMPANY NAME Website Configuration Email 👻" <${process.env.EMAIL_SENDING_MESSAGE}>`, // sender address
      to: sendTo, // list of receivers
      subject: subject , // Subject line
      text: `Hello, have a nice day, ${sendTo}.` , // plain text body
      html: content(), // html body
      attachments: attachments,
   });
   // console.log("Message sent...", info.messageId);
}

// How to Send Many Files :

// await sendEmail(
//    sendTo  ,
//    subject ,
//    content ,

//    [
//       "E:/files/file1.pdf"  ,
//       "E:/files/file2.docx" ,
//       "E:/files/file3.pdf"  ,
//    ]
// );




//^ ===================================== Send Many Email To Many Personal And Many Files This Same Time =================================



export const sendBulkPersonalizedEmails = async (recipients  ,  subject)=>{
   const transporter = createTransport({
      secure: true,
      service:"gmail" ,
      auth: {
         user: process.env.EMAIL_SENDING_MESSAGE,
         pass: process.env.EMAIL_PASSWORD,
      },
      // host: "smtp.forwardemail.net",
      // port: 465,
      // secure: true,
      // auth: {
      //    user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      //    pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
      // },
   });


   for (const recipient  of recipients) {
      const {email , content , files=[]} = recipient  ;
      const attachments = files.map(filePath => ({
         filename: path.basename(filePath) ,
         path: filePath ,// full path from E:/
      }));
   
      //! send mail with defined transport object
      const info = await transporter.sendMail({
         from: `" ENTER COMPANY NAME Website Configuration Email 👻" <${process.env.EMAIL_SENDING_MESSAGE}>`, // sender address
         to: email, // list of receivers
         subject: subject , // Subject line
         text: `Hello, have a nice day, ${email}.`, // plain text body
         html: content(), // html body
         attachments: attachments,
      });
      // console.log("Message sent...", info.messageId);
   }
   return "success"
};



// const destPath1 = path.resolve(`Uploads/pdf/world.pdf`) ;
// const destPath2 = path.resolve(`Uploads/pdf/world222.pdf`) ;

// let pdf1 = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
// let pdf2 = "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf?utm_source=chatgpt.com"
// let pdf3 = "https://www.orimi.com/pdf-test.pdf?utm_source=chatgpt.com"

// const subject =  "Activate Your Account for - Enter Company Name ✔??" ;
// let codeHtml = ()=>{
//    return `
//       <p style="font-size:16px; font-weight:bold;">Submit this activated code : <span style="display:inline-block ;  padding:2px; letter-spacing: 2px; color:white;  background-color:rgb(143,84,201) ;font-size:18px;">000-000-000-000</span> If you did not request activated account, please ignore this email!</p>
//    `
// }

// let recipients = [
//    { email:"mahmoud.osman440@gmail.com" , content:codeHtml , files:[pdf1 , pdf2 , pdf3]} ,
//    { email:"al-nakhel.hos@alborglab.com" , content:codeHtml , files:[pdf1 , pdf2]} ,
// ]
// await sendBulkPersonalizedEmails(recipients  ,  subject) ;



//^ ===================================== Send Email To Many Personal And Many Files This Same Time =================================


export const sendEmail_By_SendGrid = async (sendTo ,  subject , content , files=[])=>{
   const transporter = createTransport({
      // host: "smtp.forwardemail.net",
      // port: 465,
      // secure: true,
      // auth: {
      //    user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      //    pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
      // },


         // port: 465 ,
         // secure: true ,
         // host: process.env.SMTP_HOST,
         // port: process.env.SMTP_PORT,

         host: process.env.SMTP_HOST ,                   // smtp.sendgrid.net
         port: Number(process.env.SMTP_PORT) || 587    , // 587 أو 465
         secure: Number(process.env.SMTP_PORT) === 465 , // true لو 465, false لو 587
         auth: {
            user: process.env.SMTP_USER,  // "apikey"
            pass: process.env.SMTP_PASS,  // API Key
         },
   });

   const attachments = files.map(filePath => ({
      filename: path.basename(filePath),
      path: filePath,
   }));
   
   //! send mail with defined transport object
   const info = await transporter.sendMail({
      from: `"ENTER COMPANY NAME Website Configuration Email 👻" <${process.env.FROM_EMAIL}>`, // sender address
      // from: `" SMART TREND Website Configuration Email 👻" <${process.env.EMAIL_SENDING_MESSAGE}>`, // sender address
      to: sendTo, // list of receivers
      subject: subject , // Subject line
      text: "Hello world?", // plain text body
      html: content(), // html body
      headers: {
         "X-Priority": "3",    // خفف إحساس السبام
         "X-Mailer": "Nodemailer",
      },
      attachments: attachments,
   });
   console.log("Message sent...", info.messageId);
}

