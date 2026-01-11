import QRCode  from'qrcode' ;



export const generateQRCode = async (text) => {
   try {
      if (!text) throw new Error("QR text/link is required!");
      const base64 =  QRCode.toDataURL(text, {
         errorCorrectionLevel : "H",
         width: 300 ,
         margin: 2 ,
         type: "image/jpeg" ,
         quality: 1 ,
         color: {
            dark: "#000000",   // لون النقاط
            light: "#ffffff"   // لون الخلفية
         }
      });
      return base64; // string Base64
   } catch (err) {
      throw new Error("Failed to generate QR code: " + err.message);
   }
};