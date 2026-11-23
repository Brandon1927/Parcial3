// CAPA DE PRESENTACIÓN: rutas de conductores (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/conductores.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /conductores  y  GET /conductores?ids=1,3
router.get('/:id', controller.obtener);   // GET /conductores/:id

module.exports = router;
