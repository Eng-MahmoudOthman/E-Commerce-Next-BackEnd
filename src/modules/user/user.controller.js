import { userModel } from "../../../DataBase/models/user.model.js"
import { AppError } from "../../utilities/AppError.js";
import { ApiFeature } from "../../utilities/apiFeatures.js";
import { catchError } from "../../utilities/catchError.js";
// import fs from "fs";
// import path from "path";
// import { orderModel } from "../../../DataBase/models/order.model.js";
// import { logger } from "../../utilities/logger.js";


const uploadImageSize = Number(process.env.UPLOAD_IMAGE_SIZE) || 2000000;



//& Get All Items : Very Goooooooooood
export const getAllUser = catchError(async (req, res, next) => {

   // نبدأ بتطبيق الفلترة والبحث والترتيب وتحديد الحقول
   const apiFeature = new ApiFeature(userModel.find(), req.query)
      .filter()
      .search()
      .sort()
      .fields();

   // نجيب كل العناصر بعد الفلترة (بدون ليميت)
   const filteredUser = await apiFeature.mongooseQuery.clone();
   const totalResults = filteredUser.length; // العدد الكلي بعد الفلترة فقط

   // نضيف الباجيناشن بعد الفلترة
   apiFeature.pagination();
   const users = await apiFeature.mongooseQuery;

   // لو مفيش عناصر في الصفحة الحالية
   if (!users.length) {
      return next(new AppError("Users list is empty", 404));
   }

   // إعداد بيانات الصفحة
   const currentPage = apiFeature.pageNumber;
   const limit = apiFeature.limit;
   const numberOfPages = Math.ceil(totalResults / limit);

   // ميتاداتا الباجيناشن
   const metadata = {
      currentPage,
      limit,
      numberOfPages,
      totalResults, // عدد النتائج بعد الفلترة فقط (مش الليمت)
   };

   if (currentPage < numberOfPages) metadata.nextPage = currentPage + 1;
   if (currentPage > 1) metadata.prevPage = currentPage - 1;

   // إرسال الاستجابة النهائية
   res.json({
      message: "success",
      results: totalResults, // العدد الكلي بعد الفلترة (بدون ليميت)
      metadata,
      users, // العناصر المعروضة في الصفحة الحالية فقط
   });
});




// //& Add User :
// export const addUser = catchError(
//    async (req , res , next)=>{
//       const {name , role , phone , email , birthDay , gender , password} = req.body ;

//      //& Calculation Age From BirthDay :
//       let age = 0 ;
//       let nowAge = (birthDay)=>{
//          let dateNow = new Date()
//          let birth = new Date(birthDay)
//          let diff = dateNow - birth
//          let age = Math.floor(diff/1000/60/60/24/365);
//          return age
//       }
//       age = nowAge(req.body.birthDay) ; 
//       const itemNumber = await getNextItemNumber("user") ;


//       const user = await userModel.create({itemNumber , name , gender ,  role , phone , age , birthDay , email  , password}) ;
//       const newUser = await userModel.findById(user._id).select("-password -itemNumber -creationTimeAt") ;
//       if(!newUser) return next(new AppError("User Not Added" , 404))


      
//       //*------ Logs Here -------- :
//       // logger.info(`Create User By Admin Successfully.! -  Name:${newUser.name} , id:${newUser._id}`);
//       newUser && res.json({message:"success", user:newUser})
//    }
// )



// //& Get Profile User Information  :
// export const getProfile = catchError(
//    async(req , res , next)=>{
//       const user = await userModel.findById(req.user.id).select("-password -itemNumber -creationTimeAt") ;

//       !user && next(new AppError("User Not Found" , 401))
//       user && res.json({message:"success" , user})
//    }
// )



// //& Get Single User :
// export const getSingleUser = catchError(
//    async(req , res , next)=>{
//       const user = await userModel.findById(req.params?.id).select("-password -itemNumber -creationTimeAt") ;
//       !user && next(new AppError("User Not Found" , 404))
//       user && res.json({message:"success" , user})
//    }
// )



// //& Update User :
// export const updateUser = catchError(
//    async(req , res , next)=>{
//       const {name , phone , email , birthDay , gender} = req.body ;

//       const user = await userModel.findById(req.user._id)
//       if(!user) return next(new AppError("User Not Exist.!" , 404)) ;
      
//       // 1- Check new user name or email not exist in database and not same name or email to this id :
//       const duplicateUser = await userModel.findOne({$or:[
//          { email , _id: { $ne: req.user._id } } ,
//          { phone , _id: { $ne: req.user._id } } ,
//       ]});
//       if (duplicateUser) return next(new AppError("Name or email already exists", 400));

//       //& Calculation Age From BirthDay :
//       let age = 0 ;
//       let nowAge = (birthDay)=>{
//          let dateNow = new Date()
//          let birth = new Date(birthDay)
//          let diff = dateNow - birth
//          let age = Math.floor(diff/1000/60/60/24/365);
//          return age
//       }
//       age = nowAge(birthDay) ;
//       if(name) user.name = name ;
//       if(gender) user.gender = gender ;
//       if(phone) user.phone = phone ;
//       if(email) user.email = email ;
//       if(birthDay) user.birthDay = birthDay ;
//       user.age = age ;
      
//       await user.save()

//       const userUpdated = await userModel.findById(req.user._id).select("-password -itemNumber -creationTimeAt") ;

//       !userUpdated &&  next(new AppError("User Not Exist After Updated" , 404)) ;
//       userUpdated &&  res.json({message:"success" , user:userUpdated})
//    }
// )


// //& Update Profile Color :
// export const  settingProfile = catchError(
//    async(req , res , next)=>{
//       const {fontSize , color} = req.body ;
      
//       const user = await userModel.findById(req.user._id).select("-password -itemNumber -creationTimeAt") ;
//       if(!user) return next(new AppError("User Not Exist.!" , 404)) ;
      
//       if(color){user.settingProfile.color = color ;}
//       if(fontSize){user.settingProfile.fontSize = fontSize ;}
//       await user.save() ;
      
//       const updateUser = await userModel.findById(req.user._id).select("-password -itemNumber -creationTimeAt") ;
      
//       !updateUser &&  next(new AppError("User Not Exist After Updated" , 404)) ;
//       updateUser &&  res.json({message:"success" , user:updateUser})
//    }
// ) ;


// //& Complete User Information When Login Google :
// export const completeUserInfoWhenLoginGoogle = catchError(
//    async(req , res , next)=>{
//       const {phone , birthDay , gender , password} = req.body ;
      
//       const user = await userModel.findById(req.user._id)
//       if(!user) return next(new AppError("User Not Found" , 404)) ;
      
//       //& Calculation Age From BirthDay :
//       let age = 0 ;
//       let nowAge = (birthDay)=>{
//          let dateNow = new Date()
//          let birth = new Date(birthDay)
//          let diff = dateNow - birth
//          let age = Math.floor(diff/1000/60/60/24/365);
//          return age
//       }
//       age = nowAge(birthDay) ;
//       if(phone) user.phone = phone ;
//       if(gender) user.gender = gender ;
//       if(birthDay) user.birthDay = birthDay ;
//       if(password) user.password = password ;
//       user.age = age ;
//       user.isCompleteProfile = true ;
      
//       await user.save() ;
      
//       const updateUser = await userModel.findById(req.user._id).select("-password -itemNumber -creationTimeAt") ;

//       !updateUser &&  next(new AppError("User Not Exist After Updated" , 404)) ;
//       updateUser &&  res.json({message:"success" , user:updateUser})
//    }
// ) ;




// //& Update User Role :
// export const updateUserRole = catchError(
//    async(req , res , next)=>{
//       const {role} = req.body ;
//       const {id} = req.params ;

//       const user = await userModel.findByIdAndUpdate(id , {role} , {new:true}).select("-password -itemNumber -creationTimeAt") ;

//       !user &&  next(new AppError("User Not Found" , 404))
//       user && res.json({message:"success" , user})
//    }
// )



// // //& Delete User :
// // export const deleteUser = catchError(
// //    async(req , res , next)=>{
// //       const user = await userModel.findByIdAndDelete(req.params.id , {new:true}).select("-password -itemNumber -creationTimeAt") ;
// //       if(!user) return next(new AppError("User Not Exist" , 404)) ;

// //       //^ Delete Image from Server Disk Local :
// //       if(user.imgCover){
// //          const fileName = "Uploads/users/" + path.basename(user.imgCover)
// //          if (fs.existsSync(path.resolve(fileName))) {
// //             fs.unlinkSync(path.resolve(fileName))
// //          }
// //       }


// //       //^ Delete all invoices and transform for this user :
// //       const orders = await orderModel.find({user:req.params.id}) ;      

// //       //^ Delete order files :
// //       for (const order of orders) {
// //          if (order.invoice_pdf) {
// //             try {
// //                const fileName = "Docs/" + path.basename(order.invoice_pdf)
// //                if (fs.existsSync(path.resolve(fileName))) {
// //                   fs.unlinkSync(path.resolve(fileName))
// //                }
// //             } catch (err) {
// //                console.log("Invoice file not found or already deleted:", fileName);
// //                return next(new AppError("Invoice file not found or already deleted" , 404)) ;
// //             }
// //          }

// //          if (order.transform_pdf) {
// //             try {
// //                const fileName = "Docs/" + path.basename(order.transform_pdf)
// //                if (fs.existsSync(path.resolve(fileName))) {
// //                   fs.unlinkSync(path.resolve(fileName))
// //                }
// //             } catch (err) {
// //                console.log("Transform file not found or already deleted:", fileName);
// //                return next(new AppError("Transform file not found or already deleted" , 404)) ;
// //             }
// //          }
// //       }

// //       const deletedOrders = await orderModel.deleteMany({user:req.params.id}) ;

// //       //*------ Logs Here -------- :
// //       logger.info(`Delete User Successfully.! -  Name:${user.name} , id:${user._id}`);
// //       res.json({message:"success" , user})
// //    }
// // )


// // //& Blocked Account User :
// // export const blockUser = catchError(
// //    async(req , res , next)=>{
// //       if(req.query.block){
// //          const user = await userModel.findByIdAndUpdate(req.params.id , {isBlocked:req.query.block} , {new:true}).select("-password -itemNumber -creationTimeAt") ;
// //          if(!user) return next(new AppError("User Not Found" , 404))

// //          //*------ Logs Here -------- :
// //          logger.info(`Blocked User By Admin Successfully.! -  Name:${user.name} , id:${user._id}`);
// //          return res.json({message:"success" , user})
// //       }
// //    }
// // )


// // //& change ImgCover :
// // export const changeImgCover = catchError(
// //    async(req , res , next)=>{
// //       if(!req.file) return next(new AppError("Please Choose image Cover" , 404))

// //       if((req.file.size > uploadImageSize)){
// //          return next(new AppError("Size Media Should be Less than 200 k-Byte" , 404))
// //       }

// //       const imgCover = req.file.filename ;

// //       const user = await userModel.findByIdAndUpdate(req.user._id , {imgCover}) ;
// //       if(!user) return  next(new AppError("user Not Found", 404) ) ;
      
// //       //! Delete Image from Server Disk :
// //       if(user.imgCover){
// //       const destPath = path.resolve(`Uploads/users/${path.basename(user.imgCover)}`)
// //       if(fs.existsSync(destPath)){
// //          fs.unlinkSync(path.resolve(destPath))
// //       }


// //          // const fileName = "Uploads/users/" + path.basename(user.imgCover)
// //          // fs.unlinkSync(path.resolve(fileName))
// //       }
      
// //       const newUser = await userModel.findById(req.user._id).select("-password -itemNumber -creationTimeAt") ;
      
// //       !newUser && next(new AppError("User Not Found After Change Cover", 404) ) ;
// //       newUser &&  res.json({message:"success" , user:newUser }) ;
// //    }

// // )

