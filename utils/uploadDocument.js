const cloudinary = require("./cloudinary");
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");

exports.uploadFile = async (req, res) => {
  const uploadedImages = [];
  const errorMessages = [];
  for (const file of req.watermarkedImages) {
   
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "services",
          public_id: uuidv4(),
        },
        (error, result) => {
          if (error) {
            reject({ message: "cloudinary", error });
          } else {
            uploadedImages.push(result.secure_url);
            resolve();
          }
        }
      );

      
      streamifier.createReadStream(file).pipe(stream);
    });
  }

  if (errorMessages.length > 0) {
    throw new Error(`Video upload failed: ${errorMessages.join(", ")}`);
  }
  return uploadedImages;
};
