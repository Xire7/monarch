import express from 'express';
import fileUpload from './routes/upload/fileUpload'
import dotenv from 'dotenv'
dotenv.config()
const app = express();

app.use(express.json());  // Enable JSON body parsing
const port = process.env.PORT;
//api exposure
app.get('/', (req, res) => {
  res.send('Hello from your Node.js server!');
});
app.use('/presigned-url', fileUpload);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});