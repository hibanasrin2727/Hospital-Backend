
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ===============================
// UPLOAD DIRECTORY
// ===============================

const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "doctors"
);


// Create directory if it does not exist

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}


// ===============================
// STORAGE
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDirectory);

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const fileName =
            `doctor-${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        cb(null, fileName);

    }

});


// ===============================
// FILE FILTER
// ===============================

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only image files are allowed"
            ),
            false
        );

    }

};


// ===============================
// MULTER
// ===============================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


module.exports = upload;