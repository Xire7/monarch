import express from 'express';
import fileUpload from './routes/upload/fileUpload'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';
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
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});