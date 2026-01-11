import { counterModel } from "../../DataBase/models/counter.model.js";
import { AppError } from "../utilities/AppError.js";




export async function getNextItemNumber(itemName) {
   try {
      const counter = await counterModel.findByIdAndUpdate(
         { _id: itemName },
         { $inc: { sequence_value: 1 } },
         {
            new: true ,
            upsert: true ,  //If Document Not Exist , Create New Document :
            setDefaultsOnInsert: true , // Used Default Value Before Increase Value :
         }
      );

      if (!counter || !counter.sequence_value) {
         return AppError("Failed Generate Item Number !", 404) ;
      }

      // Confirm if the value is not 1000 :
      if (counter.sequence_value < 1000) {
         counter.sequence_value = 1000 ;
         await counter.save() ;
      }

      return counter.sequence_value ;
   } catch (err) {
      console.error("Error while generating order number:", err) ;
      return AppError("Error while generating order number, Please Try Again !", 404) ;
   }
}
