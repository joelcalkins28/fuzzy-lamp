// Minimal server for testing Render deployment
const express = require('express');
const http = require('http');
const app = express();
app.get('/', (req, res) => { res.send('Hello from Render!'); });
const PORT = process.env.PORT || 10000;
console.log('Starting server on port', PORT);
app.listen(PORT, () => { console.log('Server running on port', PORT); });
