import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export const generatePresignedUrl = async (fileName: string, fileType: string): Promise<string> => {
  const params = {
    Bucket: '{process.env.S3_BUCKET_NAME}',
    Key: fileName,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); //5 min expiration
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Could not generate presigned URL");
  }
};