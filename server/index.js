const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => res.json({ status: 'MediScan API running ✅' }));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/health',    require('./routes/health'));
app.use('/api/xray',      require('./routes/xray'));
app.use('/api/report',    require('./routes/report'));
app.use('/api/assistant', require('./routes/assistant'));
app.use('/api/knowledge', require('./routes/knowledge'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });