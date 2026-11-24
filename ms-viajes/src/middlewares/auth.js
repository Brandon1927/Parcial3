const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({error: 'Token no proporcionado o formato invalido'});
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({error: 'Token invalido o expirado'});
  }
};

const soloAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({error: 'Acceso denegado: se requiere rol admin'});
  }
  next();
};

module.exports = { verificarToken, soloAdmin };