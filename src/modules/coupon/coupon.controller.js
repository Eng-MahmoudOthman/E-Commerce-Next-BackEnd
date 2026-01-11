
import { couponModel } from "../../../DataBase/models/coupon.model.js";
import { ApiFeature } from "../../utilities/apiFeatures.js";
import { AppError } from "../../utilities/AppError.js";
import { catchError } from "../../utilities/catchError.js";



//& Get All Coupons :
export const getAllCoupon = catchError(
   async(req , res , next)=>{
      let result = await couponModel.find();


      let apiFeature = new ApiFeature(couponModel.find(), req.query ).pagination().fields().search().filter().sort();
      const coupon = await apiFeature.mongooseQuery ;

      if(!coupon.length) return next(new AppError("Coupon is Empty" , 404))

      let currentPag = apiFeature.pageNumber ;
      let numberOfPages = Math.ceil(result.length  / apiFeature.limit)  ;
      let limit = apiFeature.limit  ;
      let nextPage = numberOfPages - apiFeature.pageNumber ;
      let prevPage = (numberOfPages - nextPage) - 1 ;

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
      res.json({message:"success" , results:result.length ,  metadata: metadata ,  coupon}) ;
   }
)



// "percentage", "fixed"

//& Add New Coupon :
export const addCoupon = catchError(
   async(req , res , next)=>{
      req.body.createdBy = req.user._id
      const{code , discountValue , discountType ,  expired} = req.body ;

      //^ Check Coupon Expired Date :
      const currentDate = new Date();
      const expiryDate = new Date(expired); 
      expiryDate.setHours(23 , 59 , 59 , 999) ;
      if(currentDate > expiryDate) return next(new AppError("Not Valid Coupon, Coupon Already Expired.!")) ;
      
      
      //^ Check Coupon Already Exist :
      const couponExist = await couponModel.findOne({code}) ;
      if(couponExist) return next(new AppError("Coupon Already Exist")) ;


      const coupon = await couponModel.create({
         code ,
         discountValue ,
         discountType ,
         expired ,
         createdBy:req.user._id
      }) ;

      //*------ Logs Here -------- :
      logger.info(`Create Coupon Successfully.! -  Name:${user.name} , CouponId:${coupon._id}  , id:${user._id}`);

      res.json({message:"success" , coupon})
   }
)




//& Get Single Coupon :
export const getSingleCoupon = catchError(
   async(req , res , next)=>{
      const{id} = req.params;
      const coupon = await couponModel.findById(id) ;
      
      !coupon && next(new AppError("Coupon Not Exist" , 404))
      coupon && res.json({message:"success" , coupon})
   }
)



//& Update coupon By Id :
export const updateCoupon = catchError(
   async(req , res , next)=>{
      const{id} = req.params;
      const {code , expired , discountValue , discountType} = req.body ;


      // 1- Check new user name or email not exist in database and not same name or email to this id :
      const duplicateCoupon = await couponModel.findOne({ code , _id: { $ne: id } });
      if (duplicateCoupon) return next(new AppError("Code Already Exists", 400));

      const coupon = await couponModel.findByIdAndUpdate(id  , {code , expired , discountValue , discountType} , {new:true}) ;

      !coupon &&  next(new AppError("Coupon Not Exist" , 404))
      coupon && res.json({message:"success" , coupon})
   }
)


//& Delete Coupon :
export const deleteCoupon = catchError(
   async(req , res , next)=>{
      const{id} = req.params;
      const coupon = await couponModel.findByIdAndDelete(id) ;


      !coupon &&  next(new AppError("Coupon Not Exist" , 404))
      coupon && res.json({message:"success" , coupon})
   }
)
