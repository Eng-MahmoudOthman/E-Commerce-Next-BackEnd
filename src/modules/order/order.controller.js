import { AppError } from "../../utilities/AppError.js";
import { ApiFeature } from "../../utilities/apiFeatures.js";
import { catchError } from "../../utilities/catchError.js";
import { orderModel } from "../../../DataBase/models/order.model.js";


import slugify from "slugify";
import env from "dotenv"
import fs from "fs" ;
import path from "path" ;
import axios from 'axios';



import { customAlphabet } from 'nanoid'
import { createPDF } from "../../services/createPDF.js";
import {  invoiceTemplate } from "../../templates/invoiceTemplate.js";
import { getNextItemNumber } from "../../handlers/getNextItemNumber.js";
import { getDateRange } from "../../services/getDateRange.js";
import { cartModel } from "../../../DataBase/models/cart.model.js";
import { productModel } from "../../../DataBase/models/product.model.js";
// import { logger } from "../../utilities/logger.js";
env.config() ;


const alphabet = process.env.INVOICE_NUMBER || '123456789';
const invoice_nanoid = customAlphabet(alphabet , 10) ;



//& Get All order :
export const getAllOrder = catchError(
   async(req , res , next)=>{
      const{filter} = req.query ;
      let filterObj = {};  

      //& Return Time :
      const date = getDateRange() ; 


      //^ Filter By Order Type :
      switch (filter) {
         case "pending":
            filterObj = {status:"pending"}
            break;
         case "paid":
            filterObj = {status:"paid"}
            break;
         case "shipped":
            filterObj = {status:"shipped"}
            break;
         case "completed":
            filterObj = {status:"completed"}
            break;
         case "cancelled":
            filterObj = {status:"cancelled"}
            break;
         case "approved":
            filterObj = {status:"approved"}
            break;
         case "cash":
            filterObj = {paymentType:"cash"}
            break;
         case "card":
            filterObj = {paymentType:"card"}
            break;
         case "instaPay":
            filterObj = {paymentType:"instaPay"}
            break;
         case "daily":
            filterObj = {
               creationTimeAt: {
                  $gte: date.start ,
                  $lte: date.end
               }
            }
            break;
         case "monthly":
            filterObj = {
               creationTimeAt: {
                  $gte: date.currentMonth.start ,
                  $lte: date.currentMonth.end
               }
            }
            break;
         default:
            filterObj = {
               creationTimeAt: {
                  $gte: date.currentYear.start ,
                  $lte: date.currentYear.end
               }
            }
            break;
      }

      const result = await orderModel.find(filterObj);
      const apiFeature = new ApiFeature(orderModel.find(filterObj), req.query ).pagination().fields().search().filter().sort();
      const orders = await apiFeature.mongooseQuery ;

      if(!orders.length) return next(new AppError("Orders is Empty" , 404))

      const currentPag = apiFeature.pageNumber ;
      const numberOfPages = Math.ceil(result.length  / apiFeature.limit)  ;
      const limit = apiFeature.limit  ;
      const nextPage = numberOfPages - apiFeature.pageNumber ;
      const prevPage = (numberOfPages - nextPage) - 1 ;

      let metadata = {
         currentPag: currentPag ,
         numberOfPages: numberOfPages || 1 ,
         limit: limit ,
         }

         if(nextPage >  numberOfPages  && nextPage != 0){
            metadata.nextPage  = nextPage
         }
         if(currentPag <=  numberOfPages  && prevPage != 0 ){
            metadata.prevPage  = prevPage
         }
      res.json({message:"success" , results:result.length , metadata ,  orders}) ;
   }
) ;
//& Get Logged User order :
export const getLoggedUserOrder = catchError(
   async(req , res , next)=>{
      const result = await orderModel.find({user:req.user._id});
      const apiFeature = new ApiFeature(orderModel.find({user:req.user._id}), req.query ).pagination().fields().search().filter().sort();
      const orders = await apiFeature.mongooseQuery ;
      if(!orders.length) return next(new AppError("Orders is Empty" , 404))

      const currentPag = apiFeature.pageNumber ;
      const numberOfPages = Math.ceil(result.length  / apiFeature.limit)  ;
      const limit = apiFeature.limit  ;
      const nextPage = numberOfPages - apiFeature.pageNumber ;
      const prevPage = (numberOfPages - nextPage) - 1 ;

      let metadata = {
         currentPag: currentPag ,
         numberOfPages: numberOfPages || 1 ,
         limit: limit ,
      }

      if(nextPage >  numberOfPages  && nextPage != 0){
         metadata.nextPage  = nextPage
      }
      if(currentPag <=  numberOfPages  && prevPage != 0 ){
         metadata.prevPage  = prevPage
      }
      res.json({message:"success" , results:result.length , metadata ,  orders}) ;
   }
) ;
//& Get Specific Order :
export const getSpecificOrder = catchError(
   async(req , res , next)=>{
      const {id} = req.params ;

      const order = await orderModel.findById(id);
      !order && next(new AppError("Order Not Exist" , 404))
      order && res.json({message:"success" , order}) ;
   }
) ;
//& Create Cash Order  :
export const createCashOrder = catchError(
   async(req , res , next)=>{
      const {name , gender , phone  , city , street} = req.body ;
      const address = {city , street} ;
      const company = "234234d42342d3" ;
      const invoice_number = invoice_nanoid() ;
      const itemNumber = await getNextItemNumber("itemNumber") ;


      //^ 1- Calculate 30 Day From Created Date Invoice Expiry Date :
      const newDate = new Date(); // تاريخ اليوم
      const invoiceExpiryDate = new Date(newDate); 
      invoiceExpiryDate.setDate(invoiceExpiryDate.getDate() + 30);


      //^ 2- Get Logged User Cart and calculate All Prices :
      const cart = await cartModel.findOne({user:req.user._id}) ;
      if(!cart) return next(new AppError( " Cart Not Exist", 404));
      const totalPrice  =  cart.totalPrice ;
      const totalPriceAfterDiscount  = cart.totalPriceAfterDiscount ;
      const totalContractPrice  = cart.totalContractPrice ;
      const totalNetAmount  =   totalPriceAfterDiscount - totalContractPrice ;



      //^ 3- Create Order :
      const order = new orderModel({
         itemNumber ,
         user:req.user._id ,
         name  , 
         phone ,
         gender ,
         address ,
         orderItems: cart.cartItems ,
         status : "paid" ,
         paidAt: new Date() ,
         paymentType: "cash" ,
         invoice_number ,
         company ,
         totalPrice  ,
         totalPriceAfterDiscount  ,
         totalContractPrice ,
         totalNetAmount 
      })

      //^ 4- Check Exist Coupon and Calculate Discount :
      if(cart.coupon){
         order.coupon =  {
            code : cart.coupon.code ,
            discountType : cart.coupon.discountType ,
            discountValue : cart.coupon.discountValue ,
            expired : cart.coupon.expired ,
         }
      }
      
      //^ 5- Added invoice to this Order, Save Order :
      const nameSlug = slugify(order.name ) ;
      order.invoice  =  `invoice_${nameSlug}_${invoice_number}.pdf`;
      order.invoiceExpiryDate = invoiceExpiryDate ;
      await order.save() ;


      //^ 6- Get Order After order Created, to appear populate Product in  Order Items :
      const newOrder = await orderModel.findById(order._id) ;
      if(!newOrder) return next(new AppError( " Order Not Exist", 404));
      


      //^ 7- Create Invoice Pdf  orders :
      try {
         await createPDF(invoiceTemplate , newOrder , `invoice_${nameSlug}_${invoice_number}`);

         //*------ Logs Here -------- :
         // logger.info(`Create Invoice Order Cash Successfully.! -  Name:${req.user.name} , id:${req.user._id}`);

      } catch (error) {
         //*------ Logs Here -------- :
         // logger.error(`Created Invoice Order Cash is Failed.! [${error.message}] -  Name:${req.user.name} , id:${req.user._id}`);
         return next(new AppError(error.message, 500));
         // return next(new AppError("Invoice PDF creation failed", 500));
      }


      //^ 8- increment sold && decrement quantity :
      const productId = cart.cartItems.map((item)=>{
         return (
            {
               updateOne:{
                  "filter":{_id:item.product} ,
                  "update":{$inc:{sold:item.quantity , quantity:-item.quantity}} ,
               }
            }
         )
      })
      await productModel.bulkWrite(productId) ;



      
      //^ 9- Delete Cart :
      const cartDeleted = await cartModel.findByIdAndDelete(cart._id , {new:true}) ;



      //^ 10- Return in Response New Order :
      if(!newOrder){
         //*------ Logs Here -------- :
         // logger.error(`Cash Order Failed.! -  Name:${req.user.name} , id:${req.user._id}`);
         return next(new AppError("Cash Order Failed", 400)) ;
      } 

      //*------ Logs Here -------- :
      // logger.info(`Created Cash Order Successfully.! -  Name:${req.user.name} , OrderId:${newOrder._id}  , id:${req.user._id}`);
      res.json({message:"success", order:newOrder});
   }
) ;
//& Delete Order :
export const deleteOrder = catchError(
   async(req , res , next)=>{
      const {id} = req.params ;

      const order = await orderModel.findByIdAndDelete(id , {new:true}) ;
      if(order){
         //! Delete Invoice Order from Server Disk :
         if(!(path.basename(order.invoice) === "undefined")){
            const fileNameInvoice = "Docs/" + path.basename(order.invoice)
            fs.unlinkSync(path.resolve(fileNameInvoice))
         }
      }else{
         return next(new AppError("Order Not Exist" , 404)) ;
      }


      //*------ Logs Here -------- :
      // logger.info(`Delete Order Successfully.! -  Name:${req.user.name} , OrderId:${id}  , id:${req.user._id}`);
      res.json({message:"success" })
   }
) ;















//^================================== Create Online Order And Payment With Fawaterak  ==================================
const FAWATERAK_API_KEY = process.env.FAWATERAK_API_KEY ;
const PROVIDER_KEY = process.env.PROVIDER_KEY ;
const FAWATERAK_BASE_URL = process.env.FAWATERAK_BASE_URL ;
const BASE_URL = process.env.BASE_URL ;

//& Create Payment Method :
   export const getPaymentMethods = catchError(async(req , res , next)=>{
      const  headers =  { Authorization: `Bearer ${FAWATERAK_API_KEY}`,"Content-Type": "application/json"} ;
      const {data} = await axios.get(`${FAWATERAK_BASE_URL}/api/v2/getPaymentmethods`,{headers});
      res.json({message:"success" , payment_method :data})
   }) ;
//& Create Session :
   export const createSession = async (req , res , next) => {
      try {
         const { name , phone , gender , city , street ,  payment_method_id } = req.body ;
         
         const first_name = name.split(" ")[0] ;
         const last_name = name.split(" ")[1] ;
         const cart = await cartModel.findOne({user:req.user._id}) ;
         if(!cart) return next(new AppError("Cart Not Found" , 404)) ;

         const amount = Math.round(cart.totalPriceAfterDiscount);  
         const payLoad = {
            user: req.user._id , 
            name , 
            phone , 
            gender ,  
            city , 
            street , 
         } ;

         const response = await axios.post(`${FAWATERAK_BASE_URL}/api/v2/invoiceInitPay`,
            {
               providerKey: PROVIDER_KEY,
               customer: { first_name , last_name , email:req.user.email , phone} ,
               cartItems: [
                  {
                     name: "Order Payment",
                     price: amount,
                     quantity: 1,
                  },
               ],
               cartTotal: amount , // مجموع كل المنتجات
               payLoad , 
               currency: "EGP",
               payment_method_id ,
               successUrl: `http://localhost:5000/api/v1/order/success`,
               failUrl: `http://localhost:5000/api/v1/order/fail` ,
            },
            {
            headers: {
               Authorization: `Bearer ${FAWATERAK_API_KEY}`,
               "Content-Type": "application/json",
            },
            }
         );

         const invoice = response.data ;
         //*------ Logs Here -------- :
         // logger.info(`Create Session Payment Fawaterak Successfully.! -  Name:${req.user.name}  , id:${req.user._id}`);

         res.json({ success: true, invoice: invoice.data });
      } catch (error) {
         console.error(error.response?.data || error.message);
         res.status(500).json({ success: false, message: "Error creating invoice" });
      }
   } ;
//& Success Payment :
   export const paymentSuccess = catchError(
      async(req , res , next)=>{
         res.send("✅ Payment Successful");
      }
   ) ;
//& Failed Payment 
   export const paymentFailed = catchError(
      async(req , res , next)=>{
         res.send("❌ Payment Failed");
      }
   ) ;
//& 3- Receive Webhook From Paymob :
   export const webhookMiddleWre = catchError(
      async(req , res , next)=>{
         console.log(`💰 Successfully Payment Message`);
         console.log("==================");
         console.log("req.body.pay_load" ,  req.body.pay_load)

         if(req.body.invoice_status === "paid"){
            const pay_load_obj = JSON.parse(req.body.pay_load);
            await createOnlineOrder(pay_load_obj , req , res , next)
         }
         res.json({message:"💰 Successfully Payment Message"});
   }
   ) ;
//& 4- Create Online Order :
   export const createOnlineOrder = async (data , req , res , next)=>{
      const {user , name , gender , phone  , city , street} = data ;
      const address = {city , street} ;
      const company = "234234d42342d3" ;
      const invoice_number = invoice_nanoid() ;
      const itemNumber = await getNextItemNumber("itemNumber") ;


      //^ 1- Calculate 30 Day From Created Date Invoice Expiry Date :
      const newDate = new Date(); // تاريخ اليوم
      const invoiceExpiryDate = new Date(newDate); 
      invoiceExpiryDate.setDate(invoiceExpiryDate.getDate() + 30);


      //^ 2- Get Logged User Cart and calculate All Prices :
      const cart = await cartModel.findOne({user}) ;
      if(!cart) return next(new AppError( " Cart Not Exist", 404));
      const totalPrice  =  cart.totalPrice ;
      const totalPriceAfterDiscount  = cart.totalPriceAfterDiscount ;
      const totalContractPrice  = cart.totalContractPrice ;
      const totalNetAmount  =   totalPriceAfterDiscount - totalContractPrice ;



      //^ 3- Create Order :
      const order = new orderModel({
         itemNumber ,
         user ,
         name  , 
         phone ,
         gender ,
         address ,
         orderItems: cart.cartItems ,
         status : "paid" ,
         paidAt: new Date() ,
         paymentType: "card" ,
         invoice_number ,
         company ,
         totalPrice  ,
         totalPriceAfterDiscount  ,
         totalContractPrice ,
         totalNetAmount 
      })

      //^ 4- Check Exist Coupon and Calculate Discount :
      if(cart.coupon){
         order.coupon =  {
            code : cart.coupon.code ,
            discountType : cart.coupon.discountType ,
            discountValue : cart.coupon.discountValue ,
            expired : cart.coupon.expired ,
         }
      }
      
      //^ 5- Added invoice to this Order, Save Order :
      const nameSlug = slugify(order.name ) ;
      order.invoice  =  `invoice_${nameSlug}_${invoice_number}.pdf`;
      order.invoiceExpiryDate = invoiceExpiryDate ;
      await order.save() ;


      //^ 6- Get Order After order Created, to appear populate Product in  Order Items :
      const newOrder = await orderModel.findById(order._id) ;
      if(!newOrder) return next(new AppError( " Order Not Exist", 404));
      


      //^ 7- Create Invoice Pdf  orders :
      try {
         await createPDF(invoiceTemplate , newOrder , `invoice_${nameSlug}_${invoice_number}`);

         //*------ Logs Here -------- :
         // logger.info(`Create InvoiceOrder Online Payment Successfully.! -  Name:${req.user.name} , id:${req.user._id}`);
      } catch (error) {

         //*------ Logs Here -------- :
         // logger.error(`Created Invoice Order Online Payment Cash is Failed.! [${error.message}] -  Name:${req.user.name} , id:${req.user._id}`);
         return next(new AppError(error.message, 500));
         // return next(new AppError("Invoice PDF creation failed", 500));
      }


      //^ 8- increment sold && decrement quantity :
      const productId = cart.cartItems.map((item)=>{
         return (
            {
               updateOne:{
                  "filter":{_id:item.product} ,
                  "update":{$inc:{sold:item.quantity , quantity:-item.quantity}} ,
               }
            }
         )
      })
      await productModel.bulkWrite(productId) ;



      
      //^ 9- Delete Cart :
      const cartDeleted = await cartModel.findByIdAndDelete(cart._id , {new:true}) ;



      //^ 10- Return in Response New Order :
      if(!newOrder){
         //*------ Logs Here -------- :
         // logger.error(`Online Order  Failed.! -    Name:${req.user.name} , id:${req.user._id}`);
         return next(new AppError("Online Order Failed", 400)) ;
      } 

      //*------ Logs Here -------- :
      // logger.info(`Created Online Order Successfully.! -    Name:${req.user.name} , id:${req.user._id} , OrderId:${newOrder._id}`)

      res.json({message:"success", order:newOrder});
   } ;

// 🏦 بيانات بطاقة فيزا للاختبار
// يمكنك استخدام بطاقة فيزا التالية لاختبار المعاملات الناجحة:
// رقم البطاقة: 4005 5500 0000 0001
// اسم حامل البطاقة: Fawaterak test
// تاريخ الانتهاء: 12/26
// CVV: 100
















//^================================== Create Online Order And Payment With Paymob  ==================================
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY ;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID ;
let authToken = "" ;
//& 1- Create Token In Paymob :
const getAuthToken = async () => {
   try {
      const response = await axios.post("https://accept.paymob.com/api/auth/tokens", {
         api_key: PAYMOB_API_KEY,
      });
      authToken = response.data.token;
   } catch (error) {
      console.error("Error getting auth token:", error.response?.data || error.message);
   }
};
//& 2- Create Payment Method :
export const createSessionPaymob = async (req , res , next) => {
   try {
      await getAuthToken() ;

      const { name   , gender , birthDate,  phone , age , payment , profile} = req.query;

      let integration_id ;
      switch (payment) {
         case "credit":
            integration_id = "4822951" ;
            break;
         case "vodafone":
            filterObj = {status:"paid"}
            break;
         case "orange":
            filterObj = {status:"shipped"}
            break;
         case "etisalat":
            filterObj = {status:"completed"}
            break;
         case "we":
            filterObj = {status:"cancelled"}
            break;
         case "fawry":
            filterObj = {status:"approved"}
            break;
         case "instaPay":
            filterObj = {paymentType:"cash"}
            break;
         default:
            integration_id = "4822951" ;
            break;
      }


      const amount_num = 1242343 ; 
      let amount ;  


      //^ Check Order Type if Tests Or Profiles :
      if(profile === "true"){
         if(!cart.profilePrice) return next(new AppError("Profile Price Not Exist" , 404)) ;
         amount = Math.round(4564564) * 100  ;
      }else{
         amount = Math.round(amount_num) * 100 ; 
      }


      const orderData = {
         user: req.user._id , 
         name  :name  , 
         age ,
         gender ,  
         phone , 
         birthDate , 
      } ;


      // تحويل المبلغ إلى قروش (100 جنيه = 10000 قرش)
      const orderResponse = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
         auth_token: authToken,
         delivery_needed: "false",
         amount_cents: amount ,
         currency: "EGP",
         merchant_order_id: new Date().getTime(),
         items: [],
      });
      const orderId = orderResponse.data.id;

      // طلب Payment Key
      const paymentKeyResponse = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
         auth_token: authToken,
         amount_cents: amount ,
         expiration: 3600,
         order_id: orderId,
         extra:orderData ,
         billing_data: {
            phone_number: phone ,
            first_name: "Example" ,
            last_name: "Example" ,
            email: "email@example.com" ,
            country: "EG",
            city: "......",
            state: "......", 
            street: "......",
            building: "1",
            apartment: "1",
            floor: "1",
         },
         currency: "EGP",
         integration_id: PAYMOB_INTEGRATION_ID ,
      });

      const paymentKey = paymentKeyResponse.data.token ;
      res.json({
         redirect_url: `https://accept.paymob.com/api/acceptance/iframes/865137?payment_token=${paymentKey}`,
      });

   } catch (error) {
      // console.error("Error creating payment:", error);
      console.error("Error Payment creation failed !", error.response?.data || error.message);
      res.status(500).json({ error: "Payment creation failed !" });
   }
};
//& 3- Receive Webhook From Paymob :
export const webhookMiddleWrePaymob = catchError(
   async(req , res , next)=>{
      const {success , pending , amount_cents , data , order , payment_key_claims} = req.body.obj ;  // البيانات اللي جاية من PayMob
         console.log("");
         console.log("Done Webhook Successfully" , success);
         console.log("Extra ==>" , payment_key_claims.extra);
         
      if (success) {
         console.log(`💰 Successfully Payment Message`);
         await createOnlineOrder(payment_key_claims.extra)
         console.log(`💰 Successfully Payment Message : ${data.message} ${amount_cents / 100} EGP`);
      } else {
         console.log(`❌ Failed Payment Message : ${data.message}`);
         return next(new AppError(`❌ Failed Payment Message : ${data.message}` , 401)) ;
      }
   }
)
//& 4- Create Online Order :
export const createOnlineOrderPaymob = async (data)=>{
   const{
      user , 
      name  , 
      age , 
      phone , 
      gender , 
      birthDate
   } = data ;

   const company = "323k34k2j423j4k23" ;
   const invoice_number = invoice_nanoid() ;
   const order_Number = await getNextOrderNumber() ;


   const order = await orderModel.create({
      order_Number ,
      user:user ,
      name  ,
      age , 
      cart:cart._id ,
      phone ,
      birthDate , 
      gender ,
      invoice_number ,
      isPaid : true ,
      company ,
      orderItems:[] ,
   })

   //! Added invoice to this Order :
   const nameSlug = slugify(`${order.name }`) ;
   const add_Invoice_Order = await orderModel.findByIdAndUpdate(order._id , {invoice  : `invoice_${nameSlug}_${order._id}.pdf` } , {new:true})
   
   //! Create Invoice Pdf  orders :
   try {
      await createPDF(invoiceTemplate , add_Invoice_Order , `invoice_${nameSlug}_${order._id}`);
   } catch (error) {
      console.error('Invoice PDF creation failed', error.response?.data || error.message);
      return next(new AppError("Invoice PDF creation failed" , 404)) ;
   }
   
   res.json({message:"Successfully Created New Orders By Paymob Online!" , order:add_Invoice_Order})
}
// https://paymob-method.vercel.app/webhook   
// Mastercard Approved :
// 5123456789012346
// Test Account
// 12/25
// 123
