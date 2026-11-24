const pool = require('../db');

const CAMPOS = 'id, codigo, origen, destino, fecha, pasajeros, conductor_id, creado_en';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${CAMPOS} FROM viajes ORDER BY id DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${CAMPOS} FROM viajes WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function create({ codigo, origen, destino, fecha, pasajeros, conductor_id }) {
  const [result] = await pool.query(
    'INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros, conductor_id) VALUES (?, ?, ?, ?, ?, ?)',
    [codigo, origen, destino, fecha, pasajeros, conductor_id]
  );
  return findById(result.insertId);
}

async function update(id, { codigo, origen, destino, fecha, pasajeros, conductor_id }) {
  const [result] = await pool.query(
    'UPDATE viajes SET codigo = ?, origen = ?, destino = ?, fecha = ?, pasajeros = ?, conductor_id = ? WHERE id = ?',
    [codigo, origen, destino, fecha, pasajeros, conductor_id, id]
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM viajes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };