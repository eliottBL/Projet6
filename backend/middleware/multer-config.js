const multer = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("images");



module.exports = (req, res, next) => {
    upload(req, res, () => {
        console.log(req.image);
        const { buffer, originalname } = req.file;
        const timestamp = new Date().toISOString();
        const ref = `${timestamp}-${originalname}.webp`;
        const path = './images/' + ref
        sharp(buffer)
            .webp({ quality: 20 })
            .resize({ width: 100 })
            .toFile(path);
        req.file.filename = path;
        next();
    })

};


