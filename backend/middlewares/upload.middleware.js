// Handle file uploads in memory before sending to Cloudinary

import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
