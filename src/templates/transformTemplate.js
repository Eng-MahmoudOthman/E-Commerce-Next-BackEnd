import { generateDate } from "../services/generateDateTime.js"

const date = generateDate() ;


export let transformTemplate = (data)=>{

   const total = 23456776
   // const total = data.orderItems.reduce((acc , ele)=>{
   //    return acc + ele.contract_Price ;
   // } , 0) ;

   return (
      `
      <!DOCTYPE html>
      <html>
         <head>
            <meta charset="utf-8" />      
            <style>
               .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #eee;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                  font-size: 16px;
                  line-height: 24px;
                  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                  color: #555;
               }
      
               .invoice-box table {
                  width: 100%;
                  line-height: inherit;
                  text-align: left;
               }
      
               .invoice-box table td {
                  padding: 5px;
                  vertical-align: top;
               }
      
               .invoice-box table tr td:nth-child(2) {
                  text-align: right;
               }
      
               .invoice-box table tr.top table td {
                  padding-bottom: 20px;
               }
      
               .invoice-box table tr.top table td.title {
                  font-size: 45px;
                  line-height: 45px;
                  color: #333;
               }
      
               .invoice-box table tr.information table td {
                  padding-bottom: 40px;
                  font-size: 12px;
               }
      
               .invoice-box table tr.heading td {
                  background: #eee;
                  border-bottom: 1px solid #ddd;
                  font-weight: bold;
               }
      
               .invoice-box table tr.details td {
                  padding-bottom: 20px;
               }
      
               .invoice-box table tr.item td {
                  border-bottom: 1px solid #eee;
               }
      
               .invoice-box table tr.item.last td {
                  border-bottom: none;
               }
      
               .invoice-box table tr.total td:nth-child(2) {
                  border-top: 2px solid #eee;
                  font-weight: bold;
               }
      
               @media only screen and (max-width: 600px) {
                  .invoice-box table tr.top table td {
                     width: 100%;
                     display: block;
                     text-align: center;
                  }
      
                  .invoice-box table tr.information table td {
                     width: 100%;
                     display: block;
                     text-align: center;
                     font-size: 10px;
                  }
               }
      
               /** RTL **/
               .invoice-box.rtl {
                  direction: rtl;
                  font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
               }
      
               .invoice-box.rtl table {
                  text-align: right;
               }
      
               .invoice-box.rtl table tr td:nth-child(2) {
                  text-align: left;
               }
            </style>
         </head>
      
         <body>
            <div class="invoice-box">
               <table cellpadding="0" cellspacing="0">
                  <tr class="top">

                     <h1 style=" text-align: center ; "> TREND </h1>
                     <ul style="font-weight:bold;  list-style:none;">
                        <li>Order Number: ..................</li>
                        <li>Invoice Number: ...................</li>
                        <li>Created At:  ${new Date("2025-09-09T19:02:21.772Z").toISOString().split('T')[0] } </li>
                     </ul>

                  </tr>
                  <hr/>
      
                  <tr class="information">
                     <td colspan="2">
                        <table>

                           <tr>
                              <td>
                                 Patient Name : ......................<br />
                                 Patient Age :...................... <br />
                                 Patient Birth Date : ${"2025-09-09T19:02:21.772Z".toString().split(" ").slice(1 , 4)}  <br />
                                 Patient Phone : ..........................
                              </td>
   
                              <td>
                                 Company Name : ......................<br />
                                 Branch Name: ......................<br />
                              </td>
                           </tr>

                        </table>
                     </td>
                  </tr>
      
                  <tr class="heading">
                     <td>Confirmed Code</td>
      
                     <td></td>
                  </tr>
                  <tr class="details">
                     <td style="font-weight:bold;">Approval Number</td>
      
                     <td style="font-weight:bold; font-size:25px ; letter-spacing: 2px; ">.....................</td>
                  </tr>
      
                  <tr class="heading">
                     <td>Item</td>
                     <td>Contract Price</td>
      
                     <td></td>
                  </tr>
      
                           <tr class="item">
                              <td>...............</td>
                              <td>..................</td>
                              <td></td>
                           </tr>
      
                           <tr class="item">
                              <td>...............</td>
                              <td>..................</td>
                              <td></td>
                           </tr>
      
                           <tr class="item">
                              <td>...............</td>
                              <td>..................</td>
                              <td></td>
                           </tr>
      
                           <tr class="item">
                              <td>...............</td>
                              <td>..................</td>
                              <td></td>
                           </tr>


                  <tr class="total">
                     <td style="font-weight:bold;">Total</td>
                     <td>${total}</td>
                  </tr>
      
               </table>
            </div>
         </body>
      </html>


`
   )
}

















































// export let pdf_transform = (data)=>{
//    return (
//       `
//       <!DOCTYPE html>
//       <html>
//          <head>
//             <meta charset="utf-8" />      
//             <style>
//                .invoice-box {
//                   max-width: 800px;
//                   margin: auto;
//                   padding: 30px;
//                   border: 1px solid #eee;
//                   box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
//                   font-size: 16px;
//                   line-height: 24px;
//                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
//                   color: #555;
//                }
      
//                .invoice-box table {
//                   width: 100%;
//                   line-height: inherit;
//                   text-align: left;
//                }
      
//                .invoice-box table td {
//                   padding: 5px;
//                   vertical-align: top;
//                }
      
//                .invoice-box table tr td:nth-child(2) {
//                   text-align: right;
//                }
      
//                .invoice-box table tr.top table td {
//                   padding-bottom: 20px;
//                }
      
//                .invoice-box table tr.top table td.title {
//                   font-size: 45px;
//                   line-height: 45px;
//                   color: #333;
//                }
      
//                .invoice-box table tr.information table td {
//                   padding-bottom: 40px;
//                }
      
//                .invoice-box table tr.heading td {
//                   background: #eee;
//                   border-bottom: 1px solid #ddd;
//                   font-weight: bold;
//                }
      
//                .invoice-box table tr.details td {
//                   padding-bottom: 20px;
//                }
      
//                .invoice-box table tr.item td {
//                   border-bottom: 1px solid #eee;
//                }
      
//                .invoice-box table tr.item.last td {
//                   border-bottom: none;
//                }
      
//                .invoice-box table tr.total td:nth-child(2) {
//                   border-top: 2px solid #eee;
//                   font-weight: bold;
//                }
      
//                @media only screen and (max-width: 600px) {
//                   .invoice-box table tr.top table td {
//                      width: 100%;
//                      display: block;
//                      text-align: center;
//                   }
      
//                   .invoice-box table tr.information table td {
//                      width: 100%;
//                      display: block;
//                      text-align: center;
//                   }
//                }
      
//                /** RTL **/
//                .invoice-box.rtl {
//                   direction: rtl;
//                   font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
//                }
      
//                .invoice-box.rtl table {
//                   text-align: right;
//                }
      
//                .invoice-box.rtl table tr td:nth-child(2) {
//                   text-align: left;
//                }
//             </style>
//          </head>
      
//          <body>
//             <div class="invoice-box">
//                <table cellpadding="0" cellspacing="0">
//                   <tr class="top">
//                      <td >
//                         <table>
//                         <tr>
//                         </tr>
//                            <tr>
//                               <td class="title">
//                                  Fekrah Medical 
//                               </td>
      
//                               <td style="font-weight:bold;">
//                                  Invoice Num: ${data.invoice_number}<br />
//                                  Created: ${Date.now()}<br />
//                                  Transformation_Number: ${Date.now()}
//                               </td>
//                            </tr>
//                         </table>
//                      </td>
//                   </tr>
      
//                   <tr class="information">
//                      <td colspan="2">
//                         <table>

//                            <tr>
//                               <td>
//                                  Patient Name : ${data.patient_Name}<br />
//                                  Patient Age : ${data.patient_Age} <br />
//                                  Patient City : ${data.shipping_Address.city}
//                               </td>
   
//                               <td>
//                                  Company Name : ${data.company.name}<br />
//                                  Company Phone: ${data.company.phone}<br />
//                                  Company Email : ${data.company.email}
//                               </td>
//                            </tr>

//                         </table>
//                      </td>
//                   </tr>
      
//                   <tr class="heading">
//                      <td>Confirmed Code</td>
      
//                      <td></td>
//                   </tr>
//                   <tr class="details">
//                      <td style="font-weight:bold;">Transformation Number</td>
      
//                      <td style="font-weight:bold; font-size:20px ; letter-spacing: 2px; ">${data.transform_number}</td>
//                   </tr>
      
//                   <tr class="heading">
//                      <td>Item</td>
      
//                      <td>final_amount</td>
//                   </tr>
      
//                   ${data.orderItems.map((ele)=>`
//                            <tr class="item">
//                               <td>${ele.test.name}</td>
//                               <td>EGP 00.00</td>
//                            </tr>
//                         `
//                   ).join(" ")}

//                   <tr class="total">
//                   <td style="font-weight:bold;">Total Net Amount</td>
   
//                   <td> EGP 00.00</td>
//                </tr>
      
//                </table>
//             </div>
//          </body>
//       </html>


// `
//    )
// }

