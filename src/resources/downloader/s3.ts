import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// Configuration
const REGION = "ap-southeast-1"; // e.g., "us-west-2"
const BUCKET_NAME = "v2sdownloader";
const KEY = "test.mp4"; // S3 object key (path and filename)
const CONTENT = "This is the content you want to upload."; // Content to upload

// Initialize S3 client
const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});

export async function uploadToS3(dataStream: ReadableStream) {
    try {
        // Prepare the content as a stream or a buffer
        // const stream = Readable.from(dataStream);

        // Create the S3 upload parameters
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: KEY,
            Body: dataStream,
        };

        // Upload the file
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("Success", data);
    } catch (err) {
        console.error("Error", err);
    }
}



export async function listS3Objects() {
    try {
        const listParams = {
            Bucket: BUCKET_NAME,
            MaxKeys: 20, // Limit the number of objects listed (optional)
        };

        const data = await s3Client.send(new ListObjectsV2Command(listParams));

        if (data.Contents) {
            data.Contents.forEach((item) => {
                console.log(`Object Key: ${item.Key}`);
            });
        } else {
            console.log("No objects found in the bucket.");
        }
    } catch (err) {
        console.error("Error", err);
    }
}

