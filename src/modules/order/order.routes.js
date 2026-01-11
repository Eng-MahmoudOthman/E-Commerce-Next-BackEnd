import { Router } from "express";
import * as orderControl from "./order.controller.js";
// import {validation} from "../../middleWare/validation.js";
// import { protectedRoutes } from "../../middleWare/authentication.js";
// import { authorize } from "../../middleWare/authorization.js";
// import { createCashOrderVal , createOnlineOrderVal, paramsIdVal } from "./order.validate.js";
// import { ROLES } from "../../utilities/enums.js";




const router = Router() ;


//&===================================== Get All Order ====================================================
   router.route("/")
   .get( orderControl.getAllOrder)
   // .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  orderControl.getAllOrder)
   





   // //&================================== Get Logged User Order =============================================
   // router.route("/getLoggedUserOrder")
   //    .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  orderControl.getLoggedUserOrder)








   // //&================================== Create Online Order And Payment With Fawaterak =====================================
   //    //^ 1- Get Payment Method =============================================
   //       router.route("/PaymentMethod")
   //          .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , orderControl.getPaymentMethods )
         
   //    //^ 2- Create Payment Method ===========================================
   //       router.route("/create-session")
   //       .post(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , validation(createOnlineOrderVal) ,  orderControl.createSession )


   //    //^ 3-Receive Payment Success =============================================
   //       router.route("/success")
   //          .get(orderControl.paymentSuccess)


   //    //^ 4-  Receive Payment Failed  =============================================
   //       router.route("/fail")
   //          .get(orderControl.paymentFailed)
               








   // //&================================== Create Cash Order  ===============================================================
   // router.route("/createCashOrder")
   // .post(protectedRoutes , 
   //    authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , 
   //    validation(createCashOrderVal) , 
   //    orderControl.createCashOrder
   // )





   // //&================================= Get Specific Order - Delete Order ==================================================   
   // router.route("/:id")
   //    .get(protectedRoutes , 
   //       authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , 
   //       validation(paramsIdVal) , 
   //       orderControl.getSpecificOrder)

   //    .delete(protectedRoutes , 
   //       authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER)  ,  
   //       validation(paramsIdVal) , 
   //       orderControl.deleteOrder) 


export default router ;