const pool = require('../config/db');

async function findAll(){
  const [rows] = await pool.query(
    'SELECT id, codigo, origen, destino, DATE_FORMAT(fecha, "%Y-%m-%d") AS fecha, pasajeros, conductorid FROM viajes ORDER BY id ASC'
  );
  return rows;
};

async function findById(id){
  const [rows] = await pool.query(
    'SELECT id, codigo, origen, destino, DATE_FORMAT(fecha, "%Y-%m-%d") AS fecha, pasajeros, conductor_id FROM viajes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

async function create ({ codigo, origen, destino, fecha, pasajeros, conductor_id}){
  const [result] = await pool.query(
    'INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros, conductor_id) VALUES (?, ?, ?, ?, ?, ?)',
    [codigo, origen, destino, fecha, pasajeros, conductor_id]
  );
  return findById(result.insertId);
};

async function update (id, { codigo, origen, destino, fecha, pasajeros, conductor_id}) {
  await pool.query(
    'UPDATE viajes SET codigo = ?, origen = ?, destino = ?, fecha = ?, pasajeros = ?, conductor_id = ? WHERE id = ?',
    [codigo, origen, destino, fecha, pasajeros, conductor_id, id]
  );
  return findById(id);
};

async function remove (id) {
  const [result] = await pool.query('DELETE FROM viajes WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, create, update, remove };