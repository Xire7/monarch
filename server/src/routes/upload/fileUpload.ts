import express from 'express';
import { insertWithPresignedUrl } from '../../handleUserS3Upload/createS3PresignedUrl';
import { handleUserS3Upload } from '../../handleUserS3Upload/handleS3UploadFinished';
const router = express.Router();
router.post('/upload/getPresignedUrl', async (req, res) => {
  const { fileName, fileType } = req.body;
  //temporarily authorize user to upload csv to S3
  try {
    const presignedUrl = await insertWithPresignedUrl(fileName, fileType);
    
    res.json({ presignedUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});
router.post('/upload/notifyModel', async (req, res): Promise<void> => {
  const { fileNames } = req.body;

  if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
    res.status(400).send('fileNames required');
    return;
  }

  try {
    const result = await handleUserS3Upload(fileNames); 
    res.status(200).json(result);  //forward the result S3 presigned URL to the client
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: error.message });
    console.log("Error during model processing", error)
  }
});
export default router;