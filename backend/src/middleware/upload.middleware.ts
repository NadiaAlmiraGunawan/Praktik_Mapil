import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const uploadSinggleImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //max 5MB
    },
    fileFilter: (_req,file,cb) => {
        const allowedExt = /\.(jpg|jpeg|png|gif|webp)$/i;
        const isValidExt = allowedExt.test(path.extname(file.originalname));
        const isValidMime = file.mimetype.startsWith("image/");

        console.log("NAMA FILE:", file.originalname);
        console.log("MIME TYPE:", file.mimetype);
        
         if (isValidExt || isValidMime) {
            cb(null,true);
        }  else {
            cb(new Error ("hanya file gambar yang diperbolehkan"));
        }
    },
}).single("image"); // image adalah key/field saat upload file
