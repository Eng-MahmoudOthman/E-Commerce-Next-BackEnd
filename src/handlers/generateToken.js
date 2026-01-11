
import jwt from "jsonwebtoken" ;
import ms from "ms" ;



const TOKEN_EXPIRATION_ACCESS = process.env.TOKEN_EXPIRATION_ACCESS ;
const SECRET_KEY_ACCESS = process.env.SECRET_KEY_ACCESS ;
const TOKEN_EXPIRATION_REFRESH = process.env.TOKEN_EXPIRATION_REFRESH ;
const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH ;
const REMEMBER_ME_EXPIRATION = process.env.REMEMBER_ME_EXPIRATION ;
const NODE_ENV = process.env.NODE_ENV ;




export function  generateAccessToken(res , user){
   const token = jwt.sign(
      {
         _id:user._id , 
         role:user.role ,
      } , 
      SECRET_KEY_ACCESS , 
      {expiresIn: TOKEN_EXPIRATION_ACCESS} 
   ) ;
   
   res.cookie( "accessToken" , token , {
      httpOnly: true,
      secure: NODE_ENV === "production" ,              // خليها true في HTTPS
      // sameSite: "strict", // Use strict if front and back same domain
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      maxAge:  ms(TOKEN_EXPIRATION_ACCESS)   //ms Library Formate (1d) to MilliSecond 
   });
   return token ;
} ;



export function  generateRefreshToken(res , device , isRememberMe){
   const duration = isRememberMe? REMEMBER_ME_EXPIRATION : TOKEN_EXPIRATION_REFRESH ;

   const token = jwt.sign(
      {
         user : device.user ,
         userAgent:device.userAgent ,
         sessionID:device.sessionID ,
         deviceIP:device.deviceIP 
      } , 
      SECRET_KEY_REFRESH , 
      {expiresIn: duration } 
   ) ;
   res.cookie( "refreshToken" , token , {
      httpOnly: true,
      secure: NODE_ENV === "production" ,              // خليها true في HTTPS
      // sameSite: "strict", // Use strict if front and back same domain
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      maxAge:  ms(duration)   //ms Library Formate (1d) to MilliSecond 
   });
   return {token , duration} ;
}


