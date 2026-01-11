import { Schema, Types, model } from "mongoose";



const schema = new Schema({
   user: {
      type: Types.ObjectId,
      ref: "user",
      required: true
   },
   refreshToken: {
      type: String,
      required: true,
      unique: true
   },
   sessionID: {
      type: String,
      required: true,
      unique: true
   },
   userAgent: {
      type: String,
      required: true
   },
   deviceIP: {
      type: String,
   },
   expiresAt:{
      type: Date,
   } ,
   createdAt: {
      type: Date,
      default: Date.now ,
   } 
} , { timestamps:true } );



// Delete All Document After Expired Date Dynamic Without Any Request To Server :
   schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const sessionModel = model("session", schema);

