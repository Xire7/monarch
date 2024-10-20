import express from 'express';

import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';

import fileUpload from './routes/upload/fileUpload'
import chatWithModel from './routes/model/chatWithModel'
const app = express();
const sessionFiles: { [sessionId: string]: string[] } = {};
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

const port = process.env.PORT;
app.post('/start-session', (req, res) => {
  // Generate a new session ID and return it
  const sessionId = uuidv4();
  sessionFiles[sessionId] = [];
  res.json({ sessionId });
});

//api exposure
app.get('/', (req, res) => {
  res.send('Hello from your Node.js server!');
});
app.use('/', fileUpload);
app.use('/', chatWithModel);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});