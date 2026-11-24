const viajesService = require('../services/viajes.service');

async function listar(req, res, next) {
  try {
    const viajes = await viajesService.listarViajes(req.headers.authorization, req.query);
    res.status(200).json(viajes);
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const data = await viajesService.obtenerViaje(Number(req.params.id), req.headers.authorization);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const data = await viajesService.crearViaje(req.body, req.headers.authorization);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const data = await viajesService.actualizarViaje(Number(req.params.id), req.body, req.headers.authorization);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    await viajesService.eliminarViaje(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };