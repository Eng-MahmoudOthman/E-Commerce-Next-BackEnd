import { Router } from "express";
import * as PC from "./product.controller.js";
// import { validation } from "../../middleWare/validation.js";
// import { protectedRoutes } from "../../middleWare/authentication.js";
// import { authorize } from "../../middleWare/authorization.js";
// import { ROLES } from "../../utilities/enums.js";
// import { multerLocal, validExtension } from "../../services/multer.Local.js";
// import { addProductVal } from "./product.validate.js";



const router = Router();

router.route("/")
   .get(PC.getAllProduct)
   // .post(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , multerLocal(validExtension.image , "products").array("files"  , 10) , validation(addProductVal) , PC.addProduct) 





// router.route("/:slug")
//    .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  PC.getSingleProduct)




// router.route("/:id")
//    .put(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  PC.updateProduct)
//    .delete(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  PC.deleteProduct)

export default router ;