import { Router } from "express"
import userRouter from "../modules/user/user.routes.js" ;
import authRouter from "../modules/authentication/auth.routes.js" ;
import excelRouter from "../modules/excelSheet/excelSheet.routes.js" ;
import orderRouter from "../modules/order/order.routes.js" ;
import productRouter from "../modules/product/product.routes.js" ;
import couponRouter from "../modules/coupon/coupon.routes.js" ;
import cartRouter from "../modules/cart/cart.routes.js" ;



const router = Router()




   router.use("/auth" , authRouter) ;
   router.use("/users" , userRouter) ;
   router.use("/order" , orderRouter) ;
   router.use("/product" , productRouter) ;
   router.use("/coupon" , couponRouter) ;
   router.use("/cart" , cartRouter) ;

   router.use("/excel" , excelRouter) ;




export default router ;
