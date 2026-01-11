import {nanoid} from 'nanoid' ;
import { generateAccessToken, generateRefreshToken } from './generateToken.js';
import { sessionModel } from '../../DataBase/models/session.model.js';
import ms from "ms" ;




export const createSessionRefreshToken = async(req , res , user , isRememberMe)=>{
   const userAgent = req.headers["user-agent"] ;
   const sessionID =  nanoid() ;
   const deviceIP =
      req.headers["x-forwarded-for"]?.split(",")[0] ||      // لو السيرفر وراه Proxy
      req.connection?.remoteAddress || 
      req.socket?.remoteAddress ||
      req.ip ;


   // Device Information Return in Request :
   const device = {
      user : user._id ,
      userAgent ,
      sessionID ,
      deviceIP
   }


   // Create Refresh Token And Access Token :
   const refreshToken = generateRefreshToken(res , device , isRememberMe) ;
   const accessToken = generateAccessToken(res , user) ;
   const expiresAt = new Date(Date.now() + ms(refreshToken.duration));


   // Delete Any Session To This Device :
   await sessionModel.deleteMany({user: user._id, deviceIP, userAgent}) ;

   // Create Session :
   await sessionModel.create({
      user : user._id ,
      refreshToken: refreshToken.token ,
      expiresAt ,
      userAgent ,
      sessionID ,
      deviceIP 
   }) ;
};