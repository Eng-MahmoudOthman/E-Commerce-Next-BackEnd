import { Schema, model } from "mongoose";



const schema = new Schema({
   _id: {                         // اسم العداد، زي "order_Number"
      type: String ,
   },
   sequence_value: {
      type: Number,
      default: 1000,                 // تبدأ من الرقم اللي تحبه
   },
} , { timestamps:true } );

export const counterModel = model("counter", schema);



