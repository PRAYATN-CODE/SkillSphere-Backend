import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileCloudinary = async (file, folder = 'Resumes') => {
    const buffer = file?.buffer || Buffer.from(await file.arrayBuffer());

    const upload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'raw', // IMPORTANT for non-image files like PDFs, DOCs
                public_id: `${Date.now()}-${file.originalname}`
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });

    return upload;
};

export default uploadFileCloudinary;
