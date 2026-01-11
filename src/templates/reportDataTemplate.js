import { generateDate } from "../services/generateDateTime.js"

const date = generateDate() ;

export const reportDataTemplate = (data)=>{


   const total_Net_Amount = 1234043

   const total_Price_Discount = 3453434



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
               }
      
               .invoice-box table tr.heading td {
                  background: #eee;
                  border-bottom: 1px solid #ddd;
                  font-weight: bold;
                  text-align:center ;
                  font-size:10px ;
               }
      
               .invoice-box table tr.details td {
                  padding-bottom: 20px;
               }
      
               .invoice-box table tr.item td {
                  border-bottom: 1px solid #eee;
                  text-align:center ;
                  font-size:10px ;
               }
      
               .invoice-box table tr.item.last td {
                  border-bottom: none;
               }
      
               .invoice-box table tr.total td {
                  border-top: 2px solid #eee;
                  font-weight: bold;
                  text-align:center ;
                  font-size:10px ;
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

                              <h1 style=" text-align: center ; "> TREND</h1>

      
                              <ul style="font-weight:bold;  list-style:none; margin-top:20px ;">
                                 <li>Created At:  ${date}</li>
                                 ${true ? `<li>From   : ${"2025-09-09T19:02:21.772Z".split("-").reverse().join("-")} <span style="margin-left:300px;"> To : ${true ? "2025-09-09T19:02:21.772Z".split("-").reverse().join("-")  : `Today ${date}`}</span> </li>` : ""}
                              </ul>

                  </tr>
                  <hr/>
      
                  <tr class="information">
                     <td colspan="2">
                        <table>

                           <tr>
                              <td>
                                 Patient Name :.......................<br />
                                 Patient Age : ......................<br />
                                 Patient Birthday : ...................
                              </td>
                           </tr>

                        </table>
                     </td>
                  </tr>

                  <tr class="heading">
                     <td>Number</td>
                     <td>Order</td>
                     <td>Name</td>
                     <td>Phone</td>
                     <td>Invoice</td>
                     <td>Company</td>
                     <td>Date</td>
                     <td>Payment</td>
                     <td>Net Amount</td>
                  </tr>
      

                        <tr class="item">
                           <td>...............</td>
                           <td>...................</td>
                           <td>..........................</td>
                           <td>.........................</td>
                           <td>..........................</td>
                           <td>.............................</td>
                           <td>${new Date("2025-09-09T19:02:21.772Z").toString().slice(0 , 24)}</td>
                           <td>...........................</td>
                           <td>............................</td>
                        </tr>



                  <tr class="total heading">
                     <td>Total</td>
                     <td></td>
                     <td></td>
                     <td></td>      
                     <td></td>      
                     <td></td>      
                     <td></td>      
                     <td> ${Math.round(total_Price_Discount ) }.00</td>
                     <td> ${ Math.round(total_Net_Amount )}.00</td>
               </tr>
      
               </table>
            </div>
         </body>
      </html>


`
   )
}