import { Router } from "express";
import * as UC from "./user.controller.js";
// import { validation } from "../../middleWare/validation.js";
// import { addUserVal, blockedAndActiveUserVal , completeUserInfoWhenLoginGoogleVal, paramsIdVal, SettingProfileVal, singleVal, updateUserRoleVal, updateUserVal } from "./user.validate.js";
// import { protectedRoutes } from "../../middleWare/authentication.js";
// import { authorize } from "../../middleWare/authorization.js";
// import { multerLocal, validExtension } from "../../services/multer.Local.js";
// import { ROLES } from "../../utilities/enums.js";
// import { accountExist } from "../../middleWare/accountExist.js";



const router  = Router() ; 


//^=========================== Get Users, Add User, Change Image ==============================================
	router.route("/")
		.get(UC.getAllUser)
		// .get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR) , UC.getAllUser)

// 		.post (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR) , validation(addUserVal) ,  accountExist  ,  UC.addUser) 
// 		.patch (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , multerLocal(validExtension.image , "users").single("file") ,  validation(singleVal) ,  UC.changeImgCover) 
// 		.put (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER ) ,  validation(updateUserVal) , UC.updateUser) 



// //^=========================== Get Information Users To Dashboard =============================================
// 	router.route("/getProfile")
// 		.get (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) , UC.getProfile) 



// //^=========================== Get Information Users To Dashboard =============================================
// 	router.route("/completeProfile")
// 		.put (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  validation(completeUserInfoWhenLoginGoogleVal) , UC.completeUserInfoWhenLoginGoogle) 




		
// //^=========================== Get Information Users To Dashboard =============================================
// 	router.route("/settingProfile")
// 		.patch (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER) ,  validation(SettingProfileVal) , UC.settingProfile) 





// //^=========================== Get User, Update, Block, Delete User ===========================================
// 	router.route("/:id")
// 		.get(protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR , ROLES.USER ) , validation(paramsIdVal) , UC.getSingleUser)
// 		.delete (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR) ,  validation(paramsIdVal) , UC.deleteUser) 
// 		.patch (protectedRoutes , authorize(ROLES.ADMIN , ROLES.MODERATOR) ,  validation(blockedAndActiveUserVal) , UC.blockUser) 





// //^=========================== Update User Role ===============================================================
// 	router.route("/role/:id")
// 		.patch (protectedRoutes , authorize(ROLES.ADMIN) ,  validation(updateUserRoleVal) , UC.updateUserRole) 


export default router ;


