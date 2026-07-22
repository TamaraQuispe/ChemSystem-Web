const express = require('express');
const cors = require('cors');
const multer = require('multer');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ChemSystem API', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

// Multer error handler (file too large, wrong type)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: 'El archivo excede el límite de 500 MB' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.message && err.message.startsWith('Tipo de archivo no permitido')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
