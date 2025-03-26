const express = require('express');
const router = express.Router();
const controller = require('../controllers/historicoController');

router.get('/:cliente_id', controller.getByCliente);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
