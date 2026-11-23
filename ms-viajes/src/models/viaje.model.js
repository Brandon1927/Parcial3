class Viaje {
  constructor({ id, codigo, origen, destino, fecha, pasajeros }) {
    this.id = id;
    this.codigo = codigo;
    this.origen = origen;
    this.destino = destino;
    // Formatear Date de MySQL a string AAAA-MM-DD
    this.fecha = fecha instanceof Date ? fecha.toISOString().split('T')[0] : String(fecha).split('T')[0];
    this.pasajeros = Number(pasajeros);
  }
}

module.exports = Viaje;