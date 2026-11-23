const express = require('express');
const router = express.Router();
const viajesController = require('../controllers/viajes.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.use(verificarToken);

router.get('/', viajesController.getAll);
router.get('/:id', viajesController.getById);
router.post('/', soloAdmin, viajesController.create);
router.put('/:id', soloAdmin, viajesController.update);
router.delete('/:id', soloAdmin, viajesController.remove);

module.exports = router;