const express = require('express')
app = express()
var path = require('path')

// Importing routes 
const routes =require('./routes/routes')
// Assigning routes to the application

app.use('/api',routes)
// Serving the Image files
app.use('/images',express.static(path.join(__dirname,'uploads')))

//Error Handler Middlewre
app.use(function (err, req, res, next) {
    console.error(err.stack)
    console.log(err.message);
    (err.stack)
    if (err.type === 'entity.parse.failed') {
        err.body = "Invalid JSON"
    }
    res.status(500).send({"errorMessage":err.body, "errorCode": err.status})
  })
// Server stated on port
var port = process.env.PORT || 3000
app.listen(port,function(){
    console.log("Server runing on port "+port)
})