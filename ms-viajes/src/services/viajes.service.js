const viajesRepo = require('../repositories/viajes.repository');
const HttpError = require('../utils/HttpError');

const {
  validarYObtenerConductor,
  obtenerConductorPorId,
  obtenerMapaConductores,
} = require('../clients/conductores.client');

function validarPayloadViaje(datos, esActualizacion = false) {
  const { codigo, origen, destino, fecha, pasajeros, conductor_id } = datos || {};

  if (!esActualizacion) {
    if (!codigo || !origen || !destino || !fecha || pasajeros === undefined || conductor_id === undefined) {
      throw new HttpError(400, 'Faltan campos obligatorios: codigo, origen, destino, fecha, pasajeros, conductor_id');
    }
  }

  if (pasajeros !== undefined && (!Number.isInteger(Number(pasajeros)) || Number(pasajeros) <= 0)) {
    throw new HttpError(400, 'pasajeros debe ser un entero positivo');
  }
  if (conductor_id !== undefined && (!Number.isInteger(Number(conductor_id)) || Number(conductor_id) <= 0)) {
    throw new HttpError(400, 'conductor_id debe ser un entero positivo');
  }
}

async function listarViajes(token) {
  const viajes = await viajesRepo.findAll();
  const ids = viajes.map((v) => v.conductor_id);
  const { mapa, aviso } = await obtenerMapaConductores(ids, token);

  return viajes.map((viaje) => {
    if (!mapa) {
      return { ...viaje, conductor: null, aviso };
    }
    return {
      ...viaje,
      conductor: mapa.get(viaje.conductor_id) || null,
    };
  });
}

async function obtenerViaje(id, token) {
  const viaje = await viajesRepo.findById(id);
  if (!viaje) {
    throw new HttpError(404, 'Viaje no encontrado');
  }
  const { conductor, aviso } = await obtenerConductorPorId(viaje.conductor_id, token);
  if (aviso) {
    return { ...viaje, conductor: null, aviso };
  }
  return { ...viaje, conductor };
}

async function crearViaje(datos, token) {
  validarPayloadViaje(datos, false);
  const conductorId = Number(datos.conductor_id);

  const conductor = await validarYObtenerConductor(conductorId, token);
  try {
    const creado = await viajesRepo.create({
      codigo: String(datos.codigo).trim(),
      origen: String(datos.origen).trim(),
      destino: String(datos.destino).trim(),
      fecha: datos.fecha,
      pasajeros: Number(datos.pasajeros),
      conductor_id: conductorId,
    });
    return { ...creado, conductor };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, `Ya existe un viaje con el codigo ${datos.codigo}`);
    }
    throw err;
  }
}

async function actualizarViaje(id, datos, token) {
  const actual = await viajesRepo.findById(id);
  if (!actual) {
    throw new HttpError(404, 'Viaje no encontrado');
  }

  validarPayloadViaje(datos, true);
  const conductorId = datos.conductor_id !== undefined ? Number(datos.conductor_id) : actual.conductor_id;
  const conductor = await validarYObtenerConductor(conductorId, token);
  try {
    const actualizado = await viajesRepo.update(id, {
      codigo: datos.codigo !== undefined ? String(datos.codigo).trim() : actual.codigo,
      origen: datos.origen !== undefined ? String(datos.origen).trim() : actual.origen,
      destino: datos.destino !== undefined ? String(datos.destino).trim() : actual.destino,
      fecha: datos.fecha !== undefined ? datos.fecha : actual.fecha,
      pasajeros: datos.pasajeros !== undefined ? Number(datos.pasajeros) : actual.pasajeros,
      conductor_id: conductorId,
    });
    return { ...actualizado, conductor };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, `Ya existe un viaje con el codigo ${datos.codigo}`);
    }
    throw err;
  }
}

async function eliminarViaje(id) {
  const eliminado = await viajesRepo.remove(id);
  if (!eliminado) {
    throw new HttpError(404, 'Viaje no encontrado');
  }
}

module.exports = {
  listarViajes,
  obtenerViaje,
  crearViaje,
  actualizarViaje,
  eliminarViaje,
};