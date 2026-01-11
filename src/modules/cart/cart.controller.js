
import { cartModel } from "../../../DataBase/models/cart.model.js";
// import { couponModel } from "../../../DataBase/models/coupon.model.js";
// import { productModel } from "../../../DataBase/models/product.model.js";
import { AppError } from "../../utilities/AppError.js";
import { catchError } from "../../utilities/catchError.js";
// import { logger } from "../../utilities/logger.js";





//& Get Logged User to Cart :
export const getLoggedUserCart = catchError(
   async(req , res , next)=>{
      const cart = await cartModel.findOne({user:req.user._id}).populate("cartItems.product" , "title image description rateCount rateAvg");
      !cart &&  next(new AppError("Cart Not Exist" , 404))
      cart && res.json({message:"success" , cart})
   }
)




// //& Add and remove item to cart :
// export const addToCart = catchError(
//    async(req , res , next)=>{
//       let cart  = req.cart ;
//       const{ product , quantity:newQuantity}  = req.body ;

//       // Check data type of quantity equal number, Convert quantity to number for confirmation and assign default value confirmation. :
//       let quantity = Number(newQuantity);
//       if (!quantity || isNaN(quantity)) quantity = 1 ; // default 1


//       // prevent non-integer :
//       if (!Number.isInteger(quantity)) return next(new AppError("Quantity must be an integer", 400));
      
      
//       // Check product exist  :
//       let productExist = await productModel.findById(product) ;
//       if(!productExist) return next(new AppError("Product Not Exist" , 404)) ;
      
      
//       // Check quantity sold out  :
//       if(quantity > productExist.quantity){
//          return next(new AppError(`Quantity Sold Out, Available[${productExist.quantity}]` , 404)) ;
//       }
      
//       // Check item exist in cart  :
//       let item = cart?.cartItems.find((item)=>{
//          return item.product.toString() === product.toString()
//       });

//       //Update quantity item or deleted in cart item :
//       if(item){
//          if((item.quantity + quantity) > productExist.quantity) return next(new AppError("Sold Out" , 404))
            
//          if((item.quantity + quantity) <=  0) {
//             cart.cartItems = cart.cartItems.filter((ele) => 
//                ele.product.toString() !== product.toString()
//             );
//          }else{
//             item.quantity += quantity || 1 ;
//          }
//       }else{
//          if (quantity <= 0) return next(new AppError("Invalid quantity", 400));
//          cart.cartItems.push({
//             product:product ,
//             quantity:quantity ,
//             price: productExist.price ,
//             priceAfterDiscount: productExist.priceAfterDiscount ,
//             contractPrice: productExist.contractPrice
//          })
//       }
//       await cart.save() ;

//       const updatedCart = await cartModel.findOne({user:req.user._id}).populate("cartItems.product" , "title image description rateCount rateAvg");
//       res.json({message:"success" , cart:updatedCart}) ;
//    }
// )




// //& Clear Cart :
// export const ClearCart = catchError(
//    async(req , res , next)=>{
//       const cart = await cartModel.findOneAndDelete({user:req.user._id}) ;

//       //*------ Logs Here -------- :
//       // logger.info(`Clear Cart Successfully.! -  Name:${req.user.name}  , CartId:${cart._id} , id:${req.user._id}`);

//       !cart &&  next(new AppError("Cart Not Exist" , 404))
//       cart && res.json({message:"success" , cart})
//    }
// )



// //& Apply Coupon :
// export const applyCoupon = catchError(
//    async(req , res , next)=>{
//       const {coupon} = req.body ;
//       // Check Exist Cart :
//       const cart = await cartModel.findOne({user:req.user._id}) ;
//       if(!cart) return next(new AppError("Cart Not Exist" , 404));
      
//       // Check Exist Coupon :
//       const existCoupon = await couponModel.findOne({code:coupon , expired:{$gte:Date.now()}}) ;
//       if(!existCoupon) return next(new AppError("Invalid Coupon, Coupon Expired.!" , 401));
//       cart.coupon = existCoupon._id 
//       await cart.save();
      
//       // Find Again, because calculate coupon discount :
//       const cartAfterDiscount = await cartModel.findOne({user:req.user._id}).populate("cartItems.product" , "title image description rateCount rateAvg");

//       //*------ Logs Here -------- :
//       // logger.info(`Apply Coupon on Cart Successfully.! -  Name:${req.user.name}  , CartId:${cart._id} , id:${req.user._id}`);
      
//       res.json({message:"success" , cart:cartAfterDiscount})
//    }
// )