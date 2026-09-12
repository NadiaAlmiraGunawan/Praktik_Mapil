import Cloudinary from "../config/cloudinary";

// helper uploud ke cloudinary via stream buffer
export const uploudToCloudinary = (fileBuffer: Buffer): Promise<{secure_url:string; public_id: string}> => {
    return new Promise((resolve, reject) => {
        const UploadStream = Cloudinary.uploader.upload_stream(
            {
                folder: "posts",
                resource_type: "image",
            },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({
                    secure_url:result.secure_url,
                    public_id:result.public_id,
                });
            }
        );
        UploadStream.end(fileBuffer);
    });
};