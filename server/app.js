// app.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const OUTPUT_FILE = path.join(__dirname, 'output.txt');

// Configure CORS
// For development you can use { origin: '*' }.
// For production replace '*' with your frontend origin, e.g. 'https://your-frontend.example'
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});