import axios from 'axios';
import { json } from 'stream/consumers';

export const handleUserS3Upload = async (fileNames: string[]) => {
    if (fileNames.length == 0) return {success:false} //fail if empty
    //file has been uploaded by client
    try {
        //notify model to process file
        const response = await axios.post(`http://${process.env.MODEL_SERVER}:${process.env.MODEL_SERVER_PORT}/processFiles`, {
            s3ResultObjectName: fileNames,
        }); //get result URL from model after processing/upload
        const s3ResultObjectName = response.data.s3ResultObjectName
        console.log(`Model to process files ${fileNames}`);
        const resultS3Object = `https://${process.env.S3_BUCKET_NAME}-data.s3.us-west-1.amazonaws.com/${s3ResultObjectName}`;
        return { success: true, resultS3Object }; //return s3 object
    } catch (error) {
        console.error('Error notifying or retrieving from model:', error);
        throw new Error('Error notifying or retrieving from model');
    }
};