import { Schema , model } from "mongoose" ;


const schema = new Schema({
   name: String,
   email: String,
   age: Number,
} , { timestamps:true } )







export const excelModel = model("excel" , schema) ;
