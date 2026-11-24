require('dotenv').config();
const express = require('express');
const viajesRoutes = require('./routes/viajes.routes');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(logger);

app.get('/viajes/health', (_req, res) => {
  res.status(200).json({status:onkeydown, service: 'ms-viajes' });
});

app.use('/viajes', viajesRoutes);
app.use(errorHandler);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Errpr interno en ms-viajes'});
});

const PORT = Number(process.env.PORT) || 3011;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`ms-viajes escuchando en http://${HOST}:${PORT}`);
});