const pool = require('../config/db');

const CAMPOS = 'id, codigo, origen, destino, fecha, pasajeros, conductor_id, creado_en';

async function seedViajesIniciales() {
  try {
    // Verifica si ya existen viajes en la tabla para no duplicarlos
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM viajes');
    if (rows[0].total > 0) {
      return;
    }

    const viajesDemo = [
      ['VJ-101', 'Cali', 'Buga', '2026-11-25', 32, 1],
      ['VJ-102', 'Cali', 'Palmira', '2026-11-26', 24, 2],
      ['VJ-103', 'Buga', 'Tuluá', '2026-11-27', 18, 4],
    ];

    await pool.query(
      'INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros, conductor_id) VALUES ?',
      [viajesDemo]
    );

    console.log('Viajes iniciales creados automáticamente (3 registros).');
  } catch (err) {
    console.error('Error al insertar viajes iniciales:', err.message);
  }
}

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

module.exports = { findAll, findById, create, update, remove, seedViajesIniciales};