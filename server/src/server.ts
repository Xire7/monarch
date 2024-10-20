import express from 'express';

const app = express();
const port = 3000;
//api exposure
app.get('/', (req, res) => {
  res.send('Hello from your Node.js server!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});