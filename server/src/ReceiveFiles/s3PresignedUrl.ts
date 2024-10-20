import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1',
});
export const generatePresignedUrl = async (fileName: string, fileType: string) => {
    const params = {
      Bucket: 'monarch-user-input-data',
      Key: fileName,
      Expires: 60 * 5, //5 minute expiry
      ContentType: fileType,
    };
  
    try {
      const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
      return presignedUrl;
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  };