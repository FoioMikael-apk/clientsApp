const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController'); // ✅ ISSO AQUI


router.get('/historico/pdf/:cliente_id', exportController.exportHistoricoPDF);
router.get('/excel', exportController.exportAllExcel);
router.get('/pdf', exportController.exportAllPDF);


router.get('/historico/excel/:cliente_id', exportController.exportHistoricoExcel);
router.post('/historico/pdf-multiplos', exportController.exportHistoricoPDFMultiplos);
router.post('/historico/excel-multiplos', exportController.exportHistoricoExcelMultiplos);

module.exports = router;
