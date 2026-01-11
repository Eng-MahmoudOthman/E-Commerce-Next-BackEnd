import { AppError } from "../utilities/AppError.js";





export const validation = (schema) => {
	return (req, res, next) => {
		const validationErrors = [] ;
		let filter = {} ;
		if(req.file){
			filter = {...req.body , ...req.query , ...req.params , file:req.file }
		}else if(req.files){
			filter = {...req.body , ...req.query , ...req.params  , files:req.files}
		}else {
			filter = {...req.body , ...req.query , ...req.params  }
		}

		const {error} = schema.validate(filter, { abortEarly: false})
			
		if(!error){
			return next()
		}


		
		error.details.forEach(ele => {
			validationErrors.push(ele.message.split('"').join(""))
		});
		if(validationErrors.length){
			return next(new AppError(validationErrors , 401))
		}
	}
}



