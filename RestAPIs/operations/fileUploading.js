// For uploading file(s) to the server
var multer = require('multer')

// Initializing the multer -- destination of file and filetype
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      console.log(file)
      var filetype = ''
      if(file.mimetype === 'image/gif') {
        filetype = 'gif'
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png'
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpeg'
      }
      if(file.mimetype === 'image/jpg') {
        filetype = 'jpg'
      }
      // Image name 
      cb(null, 'Image-' + Date.now() + '.' + filetype)
    }
})

// Exporting Multer instance 
module.exports =  upload = multer({storage: storage})

