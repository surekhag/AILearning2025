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

// POST /api/write expects JSON body: { "url": "/some/path", "content": "text to write" }
app.post('/api/write', async (req, res) => {
  try {
    const { url, content } = req.body ?? {};
    console.log("inside callback function");
    if (!url || typeof url !== 'string' || !content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: 'Request must include string fields "url" and "content".' });
    }

    // Simple sanitization: remove newlines from url and content to keep file entries tidy
    const safeUrl = url.replace(/\r?\n/g, ' ');
    const safeContent = content.replace(/\r?\n/g, ' ');

    const entry = `[${new Date().toISOString()}] URL: ${safeUrl} -> ${safeContent}\n`;

    await fs.appendFile(OUTPUT_FILE, entry, 'utf8');

    return res.json({ success: true, message: 'Content written to file' });
  } catch (err) {
    console.error('Write error:', err);
    return res.status(500).json({ success: false, error: 'Server error while writing to file'
    });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});