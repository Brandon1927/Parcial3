const viajesService = require('../services/viajes.service');

const getAll = async (req, res, next) => {
  try {
    const { destino } = req.query;
    const viajes = await viajesService.listarViajes(destino);
    res.status(200).json(viajes);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const viaje = await viajesService.obtenerViajePorId(req.params.id);
    res.status(200).json(viaje);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const nuevoViaje = await viajesService.crearViaje(req.body);
    res.status(201).json(nuevoViaje);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const viajeActualizado = await viajesService.actualizarViaje(req.params.id, req.body);
    res.status(200).json(viajeActualizado);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await viajesService.eliminarViaje(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };