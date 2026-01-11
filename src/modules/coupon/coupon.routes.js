import { Router } from "express";
import * as couponControl from "./coupon.controller.js";
// import { protectedRoutes } from "../../middleWare/authentication.js";
// import { authorize } from "../../middleWare/authorization.js";
// import { ROLES } from "../../utilities/enums.js";
// import { validation } from "../../middleWare/validation.js";
// import { addCouponVal, paramVal, updateCouponVal } from "./coupon.validate.js";




//& Merge Params:
const router = Router();


//& Category :
router.route("/")
   .get(couponControl.getAllCoupon)
//    .post(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER)  , validation(addCouponVal) , couponControl.addCoupon) ;

// router.route("/:id")
//    .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER)  , validation(paramVal) , couponControl.getSingleCoupon) 
//    .put( protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER)  , validation(updateCouponVal) , couponControl.updateCoupon) 
//    .delete(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER)   ,validation(paramVal) , couponControl.deleteCoupon)

export default router ;