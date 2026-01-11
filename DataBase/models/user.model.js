import { Schema, Types, model } from "mongoose";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";



const schema = new Schema({
   itemNumber:{
      type:String ,
      unique:[true , " User Number is Unique"]
   } , 
   name:{
      type:String , 
      trim : true ,
      required : true ,
      lowercase:true ,
      minLength:[2 , "Should be Character Count More Than 2 Character"] ,
      maxLength:[50 , "Should be Character Count Less Than 50 Character"] ,
   } ,
   googleId: { 
      type: String , 
      unique: true ,
      sparse: true     // Create Index put I use it when not all documents have the same field that I want to index.
   } ,
   gender:{
      type:String ,
      enum:["male" , "female"] ,
      default:"male"
   } ,
   phone:{
      type:String ,
      unique:[true , "Phone is Unique"] ,
      match: [/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"]
   } ,
   email:{
      type:String ,
      required:true ,
      lowercase:true ,
      unique:[true , "Email is Unique"]
   } ,
   password :{
      type:String ,
      required: function () {
         return !this.googleId ;     // لو مفيش تسجيل بجوجل، يبقى الباسورد لازم
      } ,
   } ,
   settingProfile:{
      color:{
         type:String ,
         default:"#c30bf6" 
      } ,   
      fontSize:{
         type:Number ,
         default: 16
      } ,
   } ,
   age: {
      type:Number , 
   } ,
   otp_code :{
      type:String
   } ,
   otpExpiry: {
      type:Date
   },
   resetToken: {
      type:String
   },
   resetTokenExpiry : {
      type:Date
   },
   birthDay:{
      type:Date , 
   } ,
   imgCover:{
      type:String
   } ,
   addresses:[{
      street:String , 
      phone:String ,
      city :String
   }] ,
   isBlocked:{
      type:Boolean ,
      default:false
   } ,
   isCompleteProfile:{
      type:Boolean ,
      default:true
   } ,
   loginAttempts: { 
      type: Number, 
      default: 0 
   },
   lockUntil: { 
      type: Date 
   } ,
   confirmedEmail:{
      type:Boolean ,
      default:false
   } ,
   role:{
      type:String ,
      lowercase:true , 
      enum:["user" , "admin" , "moderator"] ,
      default:"user"
   } ,
   passwordChangedAt:{
      type:Date 
   } ,
   creationTimeAt:{
      type:Number ,
      index:true
   }  ,
} , { timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true} } )


//& Hash Password Before Save When Add User And Added Dynamic Creation Time At :
schema.pre("save"  , function(next){
   //I use this code so that the password is not forgotten every time 
   // I save it, even if I don’t send the password. 
   // If I don’t even send the password, its value at the beginning is undefined, 
   // and thus the undefined is forgotten, and of course the result is wrong.
   if(this.isModified('password')) this.password = bcrypt.hashSync(this.password , 8) ;
   if (!this.creationTimeAt) {
      this.creationTimeAt = Date.now() ;
   }
   next()
}) ;


// // & Hash Password Before Save When Update User :
// schema.pre("findOneAndUpdate" , function(){
//    if(this._update.password) this._update.password = bcrypt.hashSync(this._update.password , 8) ; 
// }) ;



schema.pre("init" , function(doc){
   if(doc.imgCover) {
      doc.imgCover = process.env.BASE_URL + "/users/" + doc.imgCover
   }
})



export const userModel = model("user" , schema)
