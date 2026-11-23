const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Token no proporcionado o formato invalido'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return next(new HttpError(401, 'Token invalido o expirado'));
  }
};

const soloAdmin = (req, res, next) => {
  const rol = req.usuario?.rol || req.usuario?.role;
  if (rol !== 'administrador') {
    return next(new HttpError(403, 'Acceso denegado: se requiere rol administrador'));
  }
  next();
};

module.exports = { verificarToken, soloAdmin };