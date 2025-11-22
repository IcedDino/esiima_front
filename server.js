import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Since you're using "type": "module" in package.json, we need to use this boilerplate
// to get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve the static files from the Vite build output directory
app.use(express.static(path.join(__dirname, 'dist')));

// All other GET requests not handled before will return the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});