import { generateDate } from "../services/generateDateTime.js";


const date = generateDate()
export const invoiceTemplate = (data) => {   
   return (
      `
      <!DOCTYPE html>
      <html>
         <head>
            <meta charset="utf-8" />
            <style>
               .invoice-box {
                  max-width: 800px;
                  margin: -100px auto 0px;
                  padding: 30px;
                  font-size: 14px;
                  line-height: 18px;
                  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                  color: #555;
               }

               .invoice-box table {
                  width: 100%;
                  line-height: inherit;
                  text-align: left;
               }

               .invoice-box table .heading {
                  text-align: center;
               }

               .invoice-box table .item {
                  text-align: center;
               }

               .invoice-box table .total {
                  text-align: center;
                  font-weight:bold;
                  background-color:  #eee;
               }

               .invoice-box table td {
                  padding: 5px;
                  vertical-align: top;
               }

               .invoice-box img {
                  max-width: 150px;
                  margin-bottom: 20px;
               }

               .invoice-box table tr.top table td {
                  padding-bottom: 20px;
               }

               .invoice-box table tr.top table td.title {
                  font-size: 30px;
                  line-height: 45px;
                  color: #333;
               }

               .invoice-box table tr.information table td {
                  padding-bottom: 40px;
               }

               .invoice-box table tr.heading td {
                  background: #eee;
                  border-bottom: 1px solid #ddd;
                  font-weight: bold;
               }

               .invoice-box table tr.item td {
                  border-bottom: 1px solid #eee;
               }

               .invoice-box table tr.total td:nth-child(2) {
                  border-top: 2px solid #eee;
                  font-weight: bold;
               }

               .signature {
                  margin-top: 40px;
                  text-align: center;
                  font-style: italic;
                  font-size: 12px;
                  line-height: 0px;
               }

               @media only screen and (max-width: 600px) {
                  .invoice-box table tr.top table td,
                  .invoice-box table tr.information table td {
                     width: 100%;
                     display: block;
                     text-align: center;
                  }
               }

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

               @page {
                  margin: 30px 10px;
               }

               body::before {
                  content: "";
                  display: block;
                  height: 100px;
               }

               @page :first {
                  margin-top: 10px;
               }

               body:first-of-type header {
                  display: none;
               }

               .attention{
                  font-weight:bold;
                  margin:10px 0px ;
               }

               .endDate {
                  font-size: 10px ;
               }
            </style>
         </head>
         <body>

         <div class="invoice-box">

            <!-- شعار الشركة -->
            <img src="${process.env.BASE_URL}/images/invoiceLogo.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px ;" />

            <table cellpadding="0" cellspacing="0">
               <tr class="top">
                  <h1 style=" text-align: center ; ">TREND</h1>

                  <ul style="font-weight:bold; list-style:none;">
                     <li>Invoice Number:${data.invoice_number}</li>
                     <li>Order Number: ${data.invoice_number}</li>
                     <li>Company Name:${data.totalPriceAfterDiscount}</li>
                     <li>Created At: ${new Date("2025-09-09T19:02:21.772Z").toISOString().split('T')[0] }</li>
                  </ul>
               </tr>
               <hr/>

               <tr class="information">
                  <td colspan="2">
                     <table>
                        <tr>
                           <td>
                              Patient Information :- <br />
                              Name : ${data.name}<br />
                              Age :.............<br />
                              Phone : ${data.phone} <br />
                           </td>
   
                        </tr>
                     </table>
                  </td>
               </tr>
      
               <tr class="heading">
                  <td>Payment</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>${data.paymentType}</td>
               </tr>
      
               <tr class="details">
                  <td style="font-weight:bold;"> </td>
                  <td style="font-weight:bold;"> </td>
               </tr>
      
               <tr class="heading">
                  <td>Number</td>
                  <td>Item</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Price After Discount</td>
                  <td>Net Amount Price</td>
                  <td>Contract Price</td>
               </tr>
                     ${data?.orderItems.map((ele , index)=>
                        `<tr class="item">
                           <td>${index + 1}</td>
                           <td>${ele.product?.title}</td>
                           <td>${ele.quantity}</td>
                           <td>${ele.price}</td>
                           <td>${ele.priceAfterDiscount}</td>
                           <td>${ele.priceAfterDiscount}</td>
                           <td>${ele.contractPrice}</td>
                        </tr>`
                     ).join(" ")}
               <tr class="total" >
                  <td style="font-weight:bold;">Total </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>${data.totalPrice}</td>
                  <td>${data.totalPriceAfterDiscount}</td>
               </tr>

            </table>
            
            <div class="signature">
               <p>TREND - www.sm-trend.com</p>
               <p>Address: Cairo</p>
               <p>Authorized Signature</p>
               <p>________SMART_TREND________</p>
               </div>
               
            <div class="attention">
               <h3 >Attention!</h3>
               <strong class="">The validity of this invoice is 30 days from the time the order is created</strong>
            </div>

            <div>
               <p style="margin-top:150px;">Director's signature :</p>
               <img src="${process.env.BASE_URL}/images/signature.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px ;" />
               <p class="endDate"> Print At :${date}</p>
            </div>
         </body>
      </html>
      `
   );
};