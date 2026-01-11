import { Router } from "express";
import * as CartControl from "./cart.controller.js";
import { protectedRoutes } from "../../middleWare/authentication.js";
import { authorize } from "../../middleWare/authorization.js";
import { ROLES } from "../../utilities/enums.js";
import { validation } from "../../middleWare/validation.js";
import { addCartVal, applyCouponVal } from "./cart.validate.js";
import {insertCart} from "../../middleWare/insertCart.js";


const router = Router();



router.route("/")
   .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , CartControl.getLoggedUserCart)
   .post(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER), validation(addCartVal) , insertCart , CartControl.addToCart) 
   .delete(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , CartControl.ClearCart) 

router.route("/applyCoupon")
   .post(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , validation(applyCouponVal) , CartControl.applyCoupon)

export default router ;
