

export class ApiFeature {

   constructor(mongooseQuery , searchQuery){
      this.mongooseQuery = mongooseQuery 
      this.searchQuery = searchQuery
   }

   pagination(){
      if(this.searchQuery.page <= 0) this.searchQuery.page = 1
      let pageNumber = (this.searchQuery.page * 1) || 1 ;
      let limit = +(this.searchQuery.limit) || 40 ;
      let skip = (pageNumber - 1) * limit
      this.mongooseQuery.skip(skip).limit(limit);
      this.pageNumber = pageNumber
      this.limit = limit
      return  this ;
   }



   filter(){
      let filterObj = {...this.searchQuery} ;
      let excludedFields  = ["page" , "limit" , "fields" , "sort" , "keyword" , "filter"] ;
      excludedFields.forEach((ele)=>{
         delete filterObj[ele]
      })
      filterObj = JSON.stringify(filterObj)
      filterObj = filterObj.replace(/(gte|gt|lte|lt)/g , (match)=>{
         return "$" + match ;
      })
      filterObj = JSON.parse(filterObj)
      this.mongooseQuery.find(filterObj)
      return this ;
   }



   sort(){
      if(this.searchQuery.sort){
         let sortBy = this.searchQuery.sort.split(",").join(" ") ;
         this.mongooseQuery.sort(sortBy)
      }
      return this ;
   }



   fields(){
      if(this.searchQuery.fields){
         let fields = this.searchQuery.fields.split(",").join(" ") ;
         this.mongooseQuery.select(fields)
      }
      return this ;
   }



   
   search(){
      if(this.searchQuery.keyword) {
         this.mongooseQuery.find({
            $or:[
               {itemNumber:{$regex:this.searchQuery.keyword}} ,
               {title:{$regex:this.searchQuery.keyword}} ,
               {name:{$regex:this.searchQuery.keyword}} ,
               {email:{$regex:this.searchQuery.keyword}} ,
               {phone:{$regex:this.searchQuery.keyword}} , 
               {description:{$regex:this.searchQuery.keyword}} ,
            ]
         })
      }
      return this ;
   }
}




