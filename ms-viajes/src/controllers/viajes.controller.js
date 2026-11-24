const viajesService = require('../services/viajes.service');

async function listar (req, res, next){
  try {
    const data = req.query;
    const viajes = await viajesService.listarViajes(req.headers.authorization);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

async function obtener (req, res, next) {
  try {
    const data = await service.obtenerViaje(Number(req.params.id), req.headers.authorization);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

async function crear (req, res, next){
  try {
    const data = await service.crearViaje(req.body, req.headers.authorization);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

async function actualizar (req, res, next) {
  try {
    const data = await service.actualizarViaje(Number(req.params.id), req.body, req.headers.authorization);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

async function eliminar (req, res, next) {
  try {
    await service.eliminarViaje(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };