# Back-End








const startServer = () => {
      try {
         dbConnection() ;
         const server = app.listen(PORT , () => console.log(`✅  Server is running ....`)) ;
         //& Socket io Connection :
      } catch (err) {
         console.log(err) ;
      }
}
startServer() ;