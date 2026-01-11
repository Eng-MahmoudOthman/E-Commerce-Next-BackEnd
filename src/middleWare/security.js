
import helmet from "helmet";
import hpp from "hpp";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cors from "cors";
import {requestLogger} from "../utilities/logger.js";
import morgan from "morgan";
import { customAlphabet} from 'nanoid' ;
const nanoid = customAlphabet('0123456789', 6) ;

export const applySecurityMiddlewares = (app) => {

   //^1️⃣ Secure HTTP headers
      // app.use(helmet()) ;
      app.use(
         helmet.contentSecurityPolicy({
            directives: {
               defaultSrc: ["'self'"],
               imgSrc: [
                  "'self'", 
                  'data:', 
                  'blob:', 
                  'https://res.cloudinary.com'
               ] , // Allow Appear From this source
            },
         })
      );






   //^2️⃣ Enable CORS (Cross-Origin Resource Sharing)
      app.use(
         cors({
            origin: process.env.BASE_URL_FRONT_END ,  // لازم تحدد مكان الفرونت   "http://localhost:3000"
            credentials: true                 // عشان الكوكيز/التوكن يتبعت
         })
      );





   //^3️⃣ Rate limiting - Control in request count more than 100 request server in blocked 15 minutes:
      const limiter = rateLimit({
         windowMs: 15 * 60 * 1000, // 15 minute
         max: 100,
         standardHeaders: true, // Enable New headers As : Retry-After
         legacyHeaders: false,  // Disable Old HeadersAs : X-RateLimit-*

         handler: (req, res, next) => {
            const retryAfterSeconds = Math.ceil((req.rateLimit.resetTime - new Date()) / 1000);
            const minutes = Math.floor(retryAfterSeconds / 60);
            const seconds = retryAfterSeconds % 60;


            res.status(429).json({
               success: false,
               message: `Too many requests from this IP :[ ${req.ip}], please try again after 15 minutes` ,
               ip: req.ip,
               retryAfter: {
                  totalSeconds: retryAfterSeconds,
                  minutes,
                  seconds,
               } ,
               resetTime: req.rateLimit.resetTime , // Retry Time 
               limit: req.rateLimit.limit , // Time Maximum
               current: req.rateLimit.current // Number of Current Orders
            });
         }
      });


   //^ Rate Limit
      app.use('/api', limiter);
      // const limiter = rateLimit({
      //    windowMs: 15 * 60 * 1000,
      //    max: 100,
      //    message: "Too many requests from this IP, please try again after 15 minutes"
      // });


   //^4️⃣ Prevent NoSQL injection
      app.use(mongoSanitize()) ;


   //^5️⃣ Prevent XSS (Cross-site scripting)
      app.use(xss()) ;


   //^6️⃣ Prevent HTTP Parameter Pollution
      app.use(hpp()) ;

   //^7️⃣ Disable X-Powered-By header (عشان ميبقاش واضح إنك شغال Express)
      app.disable("x-powered-by");
   
   
   //^ 7- Add request id any request :
      app.use((req, res, next) => {
         req.id = req.headers["x-request-id"] || nanoid();
         res.setHeader("X-Request-Id", req.id);
         next(); 
      });
   
   
   
   //^ 8-  Middleware record any request :
   // ✨ نضيف توكن جديد للمورجان عشان يطبع الـ requestId
      morgan.token("id", (req) => req.id);
      app.use(
         morgan(
            '[:id] :method :url :status :response-time ms',
            {
               stream: {
               write: (message) => requestLogger.info(message.trim()) // يكتب في اللوج
               }
            }
         )
      );
};
