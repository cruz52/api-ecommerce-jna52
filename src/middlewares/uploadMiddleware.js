const multer = require('multer');
const path = require('path');
const fs = require("fs")

function randomName(_n, _ext, dest) {
    const posibleChars = "1234657890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ";
    let filename = "";

    for (let i = 0; i < _n; i++) {
        const random = Math.floor(Math.random() * (posibleChars.length - 1 - 0));
        
        filename += posibleChars[random];
    }

    if(fs.existsSync(__dirname + "/../../public/img/"+ dest + "/" +filename + _ext)){
        randomName(_n, _ext, dest)
    }

    return filename + _ext;
}

const upload = dest => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '/../../public/img/' + dest))
        },
        filename: (req, file, cb) => {
            cb(null, randomName(40, path.extname(file.originalname), dest))

        }
    })

    return multer({ storage })
}

module.exports = upload