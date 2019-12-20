var express = require('express')
var router = express.Router()

router.use(express.json());
router.use(express.urlencoded({extended: false}));

// Importing operation functions here
const ops = require('../operations/operations')

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

// Endpoint for uploading Image
router.post('/img', upload.single('imgFile'), function(req,res,next){
    //Getting file information
    const file = req.file
    var filetype = ops.fileType(file)
    var valid = false

     // Getting size of image
     var height, width
     try {
         height = parseInt(req.body.height)
         width =  parseInt(req.body.width)
     } catch (error) {
         height = 100
         width =  100
     }
    // Checking Image type
    if(file.mimetype === 'image/gif' || file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            valid = true
    } else{
        res.send({"error": "Please upload valid image file", "errorCode": "400"})
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
            width=== NaN? width = 300 : width
            height=== NaN? height = 300 : height
            ops.crop(baseUrl, width, height, imagePath, inputImage, outputImagePath, outputImage, res, req)
        }

    }
})


router.post('/data', function(req, res, next) {
    if (ops.isValidJSON(JSON.stringify(req.body, null, 5)) && req.body !== {}) {
            ops.jsonToCsv(req, res)
    } else {
        res.send({"errorMessage": "Invalid JSON", "errorCode": 400})
    }
})

module.exports =  router