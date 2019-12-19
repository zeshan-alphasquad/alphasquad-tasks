var resourceMonitorMiddlewareCB = require('express-watcher').resourceMonitorMiddlewareCB

module.exports = {
    performanceMetrics: function(req, res, next){
        resourceMonitorMiddlewareCB(req, res, next, function(diffJson){
        console.log(' diffJson : ', diffJson)
        // console.log(req.jsonData);
        // res.send()
        // res.send({"data": req.jsonData, "performance": diffJson})

        //   Sending Data
          req.locals.performanceMetric = {}
          req.locals.performanceMetric = diffJson
          next()
        })
}
}