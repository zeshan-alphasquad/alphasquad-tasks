// response-time-logger.js
var fs = require('fs')
function logResponseTime(req, res, next) {
    // Incomming request time 
    const now = new Date()
    const startHrTime = process.hrtime();
  
    res.on("finish", () => {
      // Getting final response time
      const elapsedHrTime = process.hrtime(startHrTime)
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6
      var timeLog = now+' - '+req.path+' : '+elapsedTimeInMs+'\n'
      // Logging time in file
      fs.appendFile('responseTimeLog.txt',  timeLog, (err) => {
        if (err) throw new Error('Couldn\'t write the data to a file');
        // console.log('Time Logged in file');
        });
      console.log("%s : %fms", req.path, elapsedTimeInMs)
    })
    next()
  }
  
module.exports = logResponseTime