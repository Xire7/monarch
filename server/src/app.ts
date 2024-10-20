import express from 'express';
import fileUpload from './routes/fileUpload'
const app = express();
const router = express.Router();
const port = 3000;
//api exposure
app.get('/', (req, res) => {
  res.send('Hello from your Node.js server!');
});
app.use('/presigned-url', fileUpload);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});