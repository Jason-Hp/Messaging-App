const multer = require('multer')
const path = require('path')

const fileStorage = multer.diskStorage({
    

    destination: (req,res,cb)=>{
        const uploadPath = path.join(__dirname,'../files')
        cb(null,uploadPath)
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now()+"--"+file.originalname)
    }
})

const upload = multer({ storage:fileStorage})

module.exports = upload;