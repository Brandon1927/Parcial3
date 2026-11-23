require('dotenv').config();
const express = require('express');
const logger = require('./middlewares/logger');
const viajesRoutes = require('./routes/viajes.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = Number(process.env.PORT) || 3011;
const HOST = process.env.HOST || '127.0.0.1';

app.use(express.json());
app.use(logger);

app.use('/viajes', viajesRoutes);

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`ms-viajes escuchando en http://${HOST}:${PORT}`);
});