import axios from 'axios';

export const handleUserS3Upload = async (fileName: string) => {
    const s3ObjectUrl = 'https://${process.env.S3_BUCKET_NAME}-data.s3.us-west-1.amazonaws.com/${fileName}';
    //file has been uploaded by client
    try {
        //notify model to process file
        const response = await axios.post('http://${process.env.MODEL_SERVER}:80/process-file', {
            s3ObjectUrl: s3ObjectUrl,
        }); //get result URL from model after processing/upload
        const resultS3Url = response.data.resultS3Url
        console.log(`Model to process file ${s3ObjectUrl}`);

        return { success: true, resultS3Url }; //return s3 url
    } catch (error) {
        console.error('Error notifying or retrieving from model:', error);
        throw new Error('Error notifying or retrieving from model');
    }
};