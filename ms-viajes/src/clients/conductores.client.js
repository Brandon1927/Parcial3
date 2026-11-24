const HttpError = require('../utils/HttpError');
const CONDUCTORES_URL =  process.env.CONDUCTORES_URL || 'http://127.0.0.1:3012';

async function pedir(ruta, token){
    try {
        return await fetch(`${CONDUCTORES_URL}${ruta}`, {
            headers: { Authorization: token},
            signal: AbortSignal.timeout(3000),
        });
        
    } catch (error) {
        return null;
    }
}

function formatearConductor(c) {
    if (!c) return null;
    return {
        id: c.id,
        nombre_conductor: c.nombre_conductor,
        licencia: c.licencia,
    };
}

async function validarYObetenerConductor(conductorId, token) {
    const respuesta = await pedir (`/conductores/${conductorId}`, token);

    if (!respuesta){
        throw new HttpError(503, 'El servicio ms-conductores no esta disponible');
    }
    if (respuesta.status == 404){
        throw new HttpError(400, `El conductor con id ${conductorId} no existe`);
    }
    if(!respuesta.ok){
        throw new HttpError(502, `Error al consultar ms-conductores`);
    }
    const data = await respuesta.json();
    return { conductor: formatearConductor(data), aviso: null};
}

async function obtenerConductorPorId(conductorId, token) {
    const respuesta = await pedir(`/conductores/${conductorId}`, token);

    if(!respuesta){
        return {conductor: null, aviso: `ms-conductores no disponible`};
    }
    if(!respuesta.ok){
        return { conductor: null, aviso : `No se pudo obtener el conductor ${conductorId}`};
    }

    const data = await respuesta.json();
    return {conductor: formatearConductor(data), aviso: null};
}

async function obtenerMapaConductores(ids, token) {
    const unicos = [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))];
    if(unicos.length === 0){
        return {mapa: new Map(), aviso: null};
    }

    const respuesta = await pedir (`/conductores?ids=${unicos.join(',')}`, token);
    if(!respuesta){
        return { mapa:null, aviso: `ms-conductores no disponible`};
    }
    if(!respuesta.ok){
        return {mapa: null, aviso: `Error al consultar el listado de conductores`};
    }

    const lista = await respuesta.json();
    const mapa = new Map();
    for(const c of lista){
        mapa.set(c.id, formatearConductor(c));
    }
    return {mapa, aviso:null};
}

module.exports = { pedir, validarYObetenerConductor, obtenerMapaConductores, obtenerConductorPorId}