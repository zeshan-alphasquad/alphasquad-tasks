var express = require('express')
var router = express.Router()

router.use(express.json());
router.use(express.urlencoded({extended: false}));

// Importing operation functions here
const ops = require('../operations/imgOps')

// Importing fileupload module
const upload = require('../operations/fileUploading')

// Getting size of an image
var sizeOf = require('image-size');

// Module for getting user IP
// require request-ip and register it as middleware
var requestIp = require('request-ip');
router.use(requestIp.mw())
router.use(function(req, res, next) {
    // by default, the ip address will be set on the `clientIp` attribute
    var ip = req.clientIp;
    console.log(ip);
    next()
});

var Metrics = require('../operations/metrics')
// Performance Metric Middleware
// router.use(resourceMonitorMiddleware)

// var resourceMonitorMiddlewareCB = require('express-watcher').resourceMonitorMiddlewareCB
// router.use(function(req, res, next){
//   resourceMonitorMiddlewareCB(req, res, next, function(diffJson){
//     console.log(' diffJson : ', diffJson)

//     // req.performanceMetric = {}
//     // req.performanceMetric = diffJson
//     // next()
//   })
// })

// Endpoint for uploading Image
router.post('/img', upload.single('imgFile'), function(req,res,next){
    //Getting file information
    const file = req.file
    var filetype = ops.fileType(file)
    var valid = false
    // Checking Image type
    if(file.mimetype === 'image/gif' || file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            valid = true
    } else{
        res.send({"error": "Please upload valid image file", "errorCode": "400"})
    }

    // Getting size of image
    var height, width
    try {
        height = parseInt(req.body.height)
        width =  parseInt(req.body.width)
    } catch (error) {
        height = 100
        width =  100
    }

    if (!file) {
        res.send({"error": "Please upload a file", "errorCode": "400"})
    }else{
        // Setting Input Image Path for Cropping
        const imagePath = './uploads/'+file.filename
        const inputImage = '/images/'+file.filename

        // Setting Output Image Path for Cropping
        var outputImagePath = './uploads/'+Date.now()+'.'+filetype
        const outputImage = '/images/'+Date.now()+'.'+filetype

        if (valid) {
            var dimensions = sizeOf(imagePath);
            var left = parseInt(dimensions.width/2)
            var top =  parseInt(dimensions.height/2)
            var baseUrl = 'localhost:3000'
            ops.crop(baseUrl, width, height, left, top, imagePath, inputImage, outputImagePath, outputImage, res, req)
        }

    }
})


router.post('/data', async function(req, res, next) {
    // console.log(res.performanceMetric);
    // console.log(req.performanceMetric);
    var fs = require('fs');
    var csvWriter = require('csv-write-stream')
    const { parse } = require('json2csv');

    if (ops.isValidJSON(JSON.stringify(req.body, null, 5))) {
        // console.log(JSON.stringify(req.body, null, 5));
        const fields = Object.keys(req.body)
        const values = Object.values(req.body)
        console.log(fields);
        console.log(values);
        try {
        const csvParsed = parse(req.body);
        // console.log(csvParsed);
        // createArrayCsvWriter
        const createCsvWriter = require('csv-writer').createArrayCsvWriter;
            const csvWriter = createCsvWriter({
                header: fields,
                path: './csvFile.csv'
            });
            
            const records = [
                values
            ];
            
            csvWriter.writeRecords(records)       // returns a promise
                .then(() => {
                    console.log('...Done');
                });
        
            
        } catch (err) {
        console.error(err);
        }
        res.json(req.body)
    } else {
        res.send({"responseText": "Invalid JSON"})
    }
})

module.exports =  router