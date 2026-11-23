const viajesRepo = require('../repositories/viajes.repository');
const HttpError = require('../utils/HttpError');

const validarPayloadViaje = (data) => {
  const { codigo, origen, destino, fecha, pasajeros } = data;

  if (!codigo || typeof codigo !== 'string' || !codigo.trim()) {
    throw new HttpError(400, 'El campo codigo es obligatorio y debe ser texto');
  }
  if (!origen || typeof origen !== 'string' || !origen.trim()) {
    throw new HttpError(400, 'El campo origen es obligatorio y debe ser texto');
  }
  if (!destino || typeof destino !== 'string' || !destino.trim()) {
    throw new HttpError(400, 'El campo destino es obligatorio y debe ser texto');
  }

  // Validar formato AAAA-MM-DD y existencia real de fecha
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  if (!fecha || typeof fecha !== 'string' || !regexFecha.test(fecha) || Number.isNaN(Date.parse(fecha))) {
    throw new HttpError(400, 'El campo fecha debe tener formato valido AAAA-MM-DD');
  }

  const numPasajeros = Number(pasajeros);
  if (!Number.isInteger(numPasajeros) || numPasajeros <= 0) {
    throw new HttpError(400, 'El campo pasajeros debe ser un entero mayor que 0');
  }

  return {
    codigo: codigo.trim(),
    origen: origen.trim(),
    destino: destino.trim(),
    fecha,
    pasajeros: numPasajeros
  };
};

const listarViajes = async (destino) => {
  return await viajesRepo.findAll(destino);
};

const obtenerViajePorId = async (id) => {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new HttpError(400, 'El id debe ser un numero entero positivo');
  }
  const viaje = await viajesRepo.findById(numId);
  if (!viaje) {
    throw new HttpError(404, `No existe un viaje con id ${numId}`);
  }
  return viaje;
};

const crearViaje = async (data) => {
  const limpio = validarPayloadViaje(data);

  const existente = await viajesRepo.findByCodigo(limpio.codigo);
  if (existente) {
    throw new HttpError(409, `Ya existe un viaje con el codigo ${limpio.codigo}`);
  }

  return await viajesRepo.create(limpio);
};

const actualizarViaje = async (id, data) => {
  const viajeActual = await obtenerViajePorId(id); // Lanza 400 o 404 si no existe
  const limpio = validarPayloadViaje(data);

  const existente = await viajesRepo.findByCodigo(limpio.codigo);
  if (existente && existente.id !== viajeActual.id) {
    throw new HttpError(409, `Ya existe otro viaje con el codigo ${limpio.codigo}`);
  }

  return await viajesRepo.update(viajeActual.id, limpio);
};

const eliminarViaje = async (id) => {
  const viajeActual = await obtenerViajePorId(id); // Lanza 400 o 404 si no existe
  await viajesRepo.remove(viajeActual.id);
};

module.exports = {
  listarViajes,
  obtenerViajePorId,
  crearViaje,
  actualizarViaje,
  eliminarViaje
};