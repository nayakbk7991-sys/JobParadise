
import { v2 as cloudinary } from "cloudinary";

const cloudName =
    process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;

const apiKey =
    process.env.API_KEY || process.env.CLOUDINARY_API_KEY;

const apiSecret =
    process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary configuration check:", {
    cloudNameLoaded: Boolean(cloudName),
    apiKeyLoaded: Boolean(apiKey),
    apiSecretLoaded: Boolean(apiSecret)
});

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

export default cloudinary;
