// import slugify from "slugify";
import { ApiFeature } from "../../utilities/apiFeatures.js";
import { productModel } from "../../../DataBase/models/product.model.js";
import { catchError } from "../../utilities/catchError.js";
import { AppError } from "../../utilities/AppError.js";
// import fs from "fs";
// import path from "path";

// const uploadImageSize = Number(process.env.UPLOAD_IMAGE_SIZE) || 2000000;





//& Get All Products :
export const getAllProduct = catchError(
   async(req , res , next)=>{
      //& Get All Products :
      const result = await productModel.find();

      const apiFeature = new ApiFeature(productModel.find(), req.query)
         .pagination()
         .fields()
         .search()
         .filter()
         .sort();

      const products = await apiFeature.mongooseQuery;

      if (!products.length)
         return next(new AppError("Products list is empty", 404));

      const currentPag = apiFeature.pageNumber;
      const limit = apiFeature.limit;
      const totalResults = result.length;
      const numberOfPages = Math.ceil(totalResults / limit);

      const metadata = {
         currentPag,
         limit,
         numberOfPages,
         totalResults,
      };

      if (currentPag < numberOfPages) {
         metadata.nextPage = currentPag + 1;
      }

      if (currentPag > 1) {
         metadata.prevPage = currentPag - 1;
      }

      res.json({
         message: "success",
         results: products.length,
         metadata,
         products,
      });
});





//& Get All Products : دى الطريقة الصحيحة 
// export const getAllItems = catchError(async (req, res, next) => {
//    const apiFeature = new ApiFeature(itemModel.find(), req.query).filter().search().sort().fields();

//    const filteredItems = await apiFeature.mongooseQuery.clone() ;
//    const totalResults = filteredItems.length ;

//    apiFeature.pagination();
//    const items = await apiFeature.mongooseQuery;

//    if (!items.length) {
//       return next(new AppError("Items list is empty", 404));
//    }

//    const currentPage = apiFeature.pageNumber;
//    const limit = apiFeature.limit;
//    const numberOfPages = Math.ceil(totalResults / limit);

//    const metadata = {
//       currentPage,
//       limit,
//       numberOfPages,
//       totalResults, 
//    };

//    if (currentPage < numberOfPages) metadata.nextPage = currentPage + 1;
//    if (currentPage > 1) metadata.prevPage = currentPage - 1;

//    res.json({message: "success",results: totalResults, metadata,items});
// });





//& Get Single Product :
export const getSingleProduct = catchError(
   async(req , res , next)=>{
      const {slug} = req.params ;
      const product = await productModel.findOne({slug}) ;

      !product && next(new AppError("Product Not Exist" , 404))
      product && res.json({message:"success" , product})
   }
)


// //& Create Product :
// export const addProduct = catchError(
//    async(req , res , next)=>{
//       const {title , description , quantity ,  price , priceAfterDiscount , contractPrice} = req.body ;

//       let images ;

//       //& Check Exist Product :
//       const productExist = await productModel.findOne({title}) ;
//       if(productExist){
//          return next(new AppError("Product Already Exist" , 402))
//       }

//       //& File Uploads :
//       if(req.files.length > 0){
//          if(req.files){
//             images = req.files.map((ele)=>{
//                if((ele.size > uploadImageSize)){
//                   return next(new AppError("Size Media Should be Less than 200 k-Byte" , 404))
//                }
//                return ele.filename
//             }) ;
//          }
//       }

//       const slug = slugify(title)
//       const product = await productModel.create({
//          title ,
//          slug ,
//          quantity ,
//          description ,
//          price ,
//          priceAfterDiscount , 
//          contractPrice ,
//          image :images[0], 
//          images ,
//          createdBy: req.user._id
//       })

//       res.json({message:"success" , product})
//    }
// )

// //& Create Product :
// export const updateProduct = catchError(
//    async(req , res , next)=>{
//       const {id} = req.params ;
//       const {title , description , quantity ,  price , priceAfterDiscount , contractPrice} = req.body ;


//       //& Check Exist Product :
//       const product = await productModel.findById(id) ;
//       if(!product){
//          return next(new AppError("Product Not Exist" , 402))
//       }

//       if(title){
//          const slug = slugify(title)
//          product.title = title ;
//          product.slug = slug ;
//       } ;

//       if(description){
//          product.description = description ;
//       } ;

//       if(quantity){
//          product.quantity = quantity ;
//       } ;

//       if(price){
//          product.price = price ;
//       } ;

//       if(priceAfterDiscount){
//          product.priceAfterDiscount = priceAfterDiscount ;
//       } ;

//       if(contractPrice){
//          product.contractPrice = contractPrice ;
//       } ;

//       await product.save() ;
//       res.json({message:"success" , product})
//    }
// )

// //& Create Product :
// export const changeProductImages = catchError(
//    async(req , res , next)=>{
//       const {id} = req.params ;
//       const {description , quantity ,  price , priceAfterDiscount , contractPrice} = req.body ;

//       let images ;

//       //& Check Exist Product :
//       const product = await productModel.findByIdAndUpdate( id ,  {
//          description , 
//          quantity ,  
//          price , 
//          priceAfterDiscount , 
//          contractPrice
//       } , {new:true}) ;

//       if(productExist){
//          return next(new AppError("Product Not Exist" , 402))
//       }

//       //& File Uploads :
//       if(req.files.length > 0){
//          if(req.files){
//             images = req.files.map((ele)=>{
//                if((ele.size > uploadImageSize)){
//                   return next(new AppError("Size Media Should be Less than 200 k-Byte" , 404))
//                }
//                return ele.filename
//             }) ;
//          }
//       }

//       res.json({message:"success" , product})
//    }
// )


// //& Delete Product :
// export const deleteProduct = catchError(
//    async(req , res , next)=>{
//       const {id} = req.params ;
//       const product = await productModel.findByIdAndDelete(id , {new:true}) ;
//       if(!product) return next(new AppError("Product Not Exist" , 404))
      

//       //^ Delete Image from Server Disk Local :
//       if(product.images.length > 0){
//          for (const ele of product.images) {
//             const fileName = "Uploads/products/" + path.basename(ele)
//             if (fs.existsSync(path.resolve(fileName))) {
//                fs.unlinkSync(path.resolve(fileName))
//             }
//          }
//       }

//       product && res.json({message:"success" , product})
//    }
// ) ;