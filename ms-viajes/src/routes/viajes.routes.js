const express = require('express');
const router = express.Router();
const viajesController = require('../controllers/viajes.controller');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;
const soloAdmin = auth.soloAdmin || ((req, res, next) =>{
    if (req.user?.rol !== 'admin'){
        return res.status(403).json({error: 'Acceso denegado: se requiere rol admin'});
    }
    next()
})
router.use(verificarToken);

router.get('/', verificarToken, viajesController.getAll);
router.get('/:id', verificarToken, viajesController.getById);
router.post('/', verificarToken, soloAdmin, viajesController.create);
router.put('/:id', verificarToken, soloAdmin, viajesController.update);
router.delete('/:id', verificarToken, soloAdmin, viajesController.remove);

module.exports = router;