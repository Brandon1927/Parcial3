// =====================================================================
// CLIENTE HTTP de ms-conductores, para el microservicio de viajes.
// Copie este archivo en ms-viajes/src/clients/ y COMPLÉTELO:
// la función pedir() ya está hecha; faltan las funciones que usan
// la validación, la regla de negocio y la composición.
// En el .env de ms-viajes:  CONDUCTORES_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const CONDUCTORES_URL = process.env.CONDUCTORES_URL;

// Hace una petición GET a ms-conductores reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-conductores no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${CONDUCTORES_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-conductores caído o sin responder
  }
}

// Ejemplo de uso:
//   const respuesta = await pedir('/conductores/3', token);
//   if (!respuesta) ...                   → ms-conductores no respondió
//   if (respuesta.status === 404) ...     → no existe
//   const datos = await respuesta.json(); → el objeto (o el arreglo, con ?ids=)

module.exports = { pedir };
