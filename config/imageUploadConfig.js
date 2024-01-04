const multer = require('multer');

const upload = multer({ dest: 'uploads/item/images' });

module.exports = upload;