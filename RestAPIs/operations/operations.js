// For resizing Image
const Jimp = require('jimp')
// For Image Cropping
const sharp = require('sharp');

// For File operations
var fs = require('fs');
// For JSON to CSV 
const { parse } = require('json2csv');
    

// Exporting rezie function
module.exports.resize = (inputImagePath, width, height, outputImage) => {
                        Jimp.read(inputImagePath, (err, image) => {
                                if (err) throw err
                                image
                                .resize(width, height) // resize
                                .quality(60) // set JPEG quality
                                .greyscale() // set greyscale
                                .write(outputImage) // save
                            }).catch(err => {
                                console.log('Error in resizing!!')
                                console.log(err)
                                res.send({"error": "Error in resizing image!", "errorCode": "500"})
                            })
}

// Function for Cropping the image
module.exports.crop = (baseUrl, width, height, left, top, imagePath, 
                                inputImage, outputImagePath, outputImage, res, req) => {
                                    sharp(imagePath).extract({ width: width, height: height, left: 0, top: 0  }).toFile(outputImagePath)
                                                            .then(function(new_file_info) {
                                                                console.log("Image cropped and saved");
                                                                res.send({  "originalImage": baseUrl+inputImage, 
                                                                            "corppedImage": baseUrl+outputImage
                                                                        })                                            
                                                                    })
                                                            .catch(function(err) {
                                                                res.send({"error": "Cropping dimensions greater then original image", "errorCode": "400"})
                                                            });

}

module.exports.fileType = (file) => {
                                            if(file.mimetype === 'image/gif') {
                                                return 'gif'
                                            }
                                            else if(file.mimetype === 'image/png') {
                                                return 'png'
                                            }
                                            else if(file.mimetype === 'image/jpeg') {
                                                return 'jpeg'
                                            }
                                            else  if(file.mimetype === 'image/jpg') {
                                                return 'jpg'
                                            }else{
                                                return 'jpg'
                                            }
}

module.exports.isValidJSON = (text) => {
                                            try{
                                                JSON.parse(text)
                                                return true
                                            }
                                            catch (error){
                                                return false
                                            }
}

module.exports.jsonToCsv = (req, res) => {  
                                    var path = 'csvFile.csv'
                                    const fields = Object.keys(req.body)
                                    const values = Object.values(req.body)
                                    // console.log(fields);
                                    // console.log(values);
                                    try {

                                            if (!fs.existsSync(path)) {
                                                    // First insertion
                                                    let csv = parse(req.body);
                                                    // Also you'd need to check if the file is empty or not to add the ',' or not on the next line
                                                    fs.writeFile('csvFile.csv',  csv, (err) => {
                                                    if (err) throw new Error('Couldn\'t write the data to a file');
                                                    console.log('The data was appended to file!');

                                                    });
                                            } else {
                                                    // Next insertions
                                                    let csv = parse(req.body, { header: false });
                                                    // Also you'd need to check if the file is empty or not to add the ',' or not on the next line
                                                    fs.appendFile('csvFile.csv',  '\n'+csv, (err) => {
                                                    if (err) throw new Error('Couldn\'t append the data to the file');
                                                    console.log('The data was appended to file!');
                                                    });
                                            }
                                    } catch (err) {
                                    console.error(err);
                                    res.send({"errorMessage": "Error in file operation"})
                                    }
                                    res.json({"jsonData": req.body})

}