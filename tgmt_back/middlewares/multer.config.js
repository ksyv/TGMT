const multer = require('multer');


const MIME_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        var name = Math.floor(Math.random() * Math.floor(15258652325)).toString();
        name += Math.floor(Math.random() * Math.floor(153456652325)).toString();
        name += Math.floor(Math.random() * Math.floor(152586532325)).toString();
        name += Math.floor(Math.random() * Math.floor(15255646980)).toString();
        name += Date.now() + '.';

        const extension = MIME_TYPES[file.mimetype];
        name += extension;
        cb(null, name)
    }
})

module.exports = multer({ storage}).single('image')