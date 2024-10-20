import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { json } from 'stream/consumers';
const s3 = new S3Client({
    region: 'us-west-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  });
export const handleUserS3Upload = async (fileNames: string[]) => {
    if (fileNames.length === 0) return {success:false} //fail if empty
    console.log("File has been uploaded by client")
    //file has been uploaded by client
    try {
        //notify model to process file
        console.log(`Model to process files ${fileNames}`);
        const response = await axios.post(`http://${process.env.MODEL_SERVER}:${process.env.MODEL_SERVER_PORT}/process-files`, {
            fileNames: fileNames,
        }); //get result fileName from model after processing/upload
        const s3ResultObjectName = response.data.s3ResultObjectName
        const params = {
            Bucket: `${process.env.S3_BUCKET_NAME}`,
            Key: s3ResultObjectName,
          };
        const command = new GetObjectCommand(params);
        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 10 }); // 10 minutes expiry
        //create a presigned url for user

        return { success: true, presignedUrl }; //return s3 object
    } catch (error) {
        console.error('Error notifying or retrieving from model:', error);
        throw new Error('Error notifying or retrieving from model');
    }
};