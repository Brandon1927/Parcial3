const pool = require('../config/db');
const Viaje = require('../models/viaje.model');

const findAll = async (destino) => {
  let query = 'SELECT id, codigo, origen, destino, fecha, pasajeros FROM viajes';
  const params = [];

  if (destino) {
    query += ' WHERE destino = ?';
    params.push(destino);
  }

  const [rows] = await pool.query(query, params);
  return rows.map((row) => new Viaje(row));
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, codigo, origen, destino, fecha, pasajeros FROM viajes WHERE id = ?',
    [id]
  );
  return rows.length ? new Viaje(rows[0]) : null;
};

const findByCodigo = async (codigo) => {
  const [rows] = await pool.query(
    'SELECT id, codigo, origen, destino, fecha, pasajeros FROM viajes WHERE codigo = ?',
    [codigo]
  );
  return rows.length ? new Viaje(rows[0]) : null;
};

const create = async ({ codigo, origen, destino, fecha, pasajeros }) => {
  const [result] = await pool.query(
    'INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros) VALUES (?, ?, ?, ?, ?)',
    [codigo, origen, destino, fecha, pasajeros]
  );
  return findById(result.insertId);
};

const update = async (id, { codigo, origen, destino, fecha, pasajeros }) => {
  await pool.query(
    'UPDATE viajes SET codigo = ?, origen = ?, destino = ?, fecha = ?, pasajeros = ? WHERE id = ?',
    [codigo, origen, destino, fecha, pasajeros, id]
  );
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM viajes WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, findByCodigo, create, update, remove };