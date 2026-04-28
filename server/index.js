const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/health',    require('./routes/health'));
app.use('/api/xray',      require('./routes/xray'));
app.use('/api/report',    require('./routes/report'));
app.use('/api/assistant', require('./routes/assistant'));
app.use('/api/knowledge', require('./routes/knowledge'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));