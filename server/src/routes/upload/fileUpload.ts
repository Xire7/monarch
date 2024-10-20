import express from 'express';
import { generatePresignedUrl } from '../../handleUserS3Upload/createS3PresignedUrl';
import { handleUserS3Upload } from '../../handleUserS3Upload/handleS3UploadFinished';
const router = express.Router();
router.post('/upload/getPresignedUrl', async (req, res) => {
  const { fileName, fileType } = req.body;
  try {
    const presignedUrl = await generatePresignedUrl(fileName, fileType);
    res.json({ presignedUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});
router.post('/upload/notifyComplete', async (req, res): Promise<void> => {
  const { fileName } = req.body;

  if (!fileName) {
    res.status(400).send('File name is required');
    return;
  }

  try {
    const result = await handleUserS3Upload(fileName);  // This includes the result S3 URL
    res.status(200).json(result);  // Forward the result S3 URL to the client
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: error.message });
    console.log(error)
  }
});
export default router;