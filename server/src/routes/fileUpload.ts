import express from 'express';
import {generatePresignedUrl} from '../ReceiveFiles/s3PresignedUrl';

const router = express.Router();
router.post('/presigned-url', async (req, res) => {
    const { fileName, fileType } = req.body;
    try {
      const presignedUrl = await generatePresignedUrl(fileName, fileType);
      res.json({ presignedUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate presigned URL' });
    }
  });
export default router;