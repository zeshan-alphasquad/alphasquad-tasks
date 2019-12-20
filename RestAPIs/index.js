const express = require('express')
app = express()
var path = require('path')

var fs = require('fs')

var resourceMonitorMiddlewareCB = require('express-watcher').resourceMonitorMiddlewareCB
 
// example with callback function
app.use(function(req, res, next){
  resourceMonitorMiddlewareCB(req, res, next, function(diffJson){

    // Checking if it's integer or not
    diffJson.diffRAM === "NaN undefined" ? diffJson.diffRAM = 0 : diffJson.diffRAM
    diffJson.diffExternal === "NaN undefined" ? diffJson.diffExternal = 0 : diffJson.diffExternal
    diffJson.diffCPU === "NaN undefined" ? diffJson.diffCPU = 0 : diffJson.diffCPU
    ramAndMemory = "RAM : " + diffJson.diffRAM + " - Memory : " 
                    + diffJson.diffExternal + " - CPU : " + diffJson.diffCPU + " - "
    // Writing Memory and RAM in Logs
    fs.appendFile('responseTimeLog.txt',  ramAndMemory, (err) => {
        if (err) throw new Error('Couldn\'t write the data to a file')
        })
  })
})


// log response time of requests
const logResponseTime = require('./operations/logResponseTime')
app.use(logResponseTime)

// Serving the Image files
app.use('/images', express.static( path.join(__dirname, 'uploads')))

// Importing routes 
const routes =require('./routes/routes')
// Assigning routes to the application

app.use('/api',routes)

//Error Handler Middlewre
app.use(function (err, req, res, next) {
    console.error(err.stack)
    console.log(err.message);
    (err.stack)
    if (err.type === 'entity.parse.failed') {
        err.body = "Invalid JSON"
    }
    res.status(500).send({"errorMessage" : err.body, "errorCode": err.status})
  })
// Server stated on port
var port = process.env.PORT || 3000
app.listen(port,function(){
    console.log("Server runing on port " + port)
    
})