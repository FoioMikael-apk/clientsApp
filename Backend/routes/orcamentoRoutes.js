const express = require('express');
const router = express.Router();
const orcamentoController = require('../controllers/orcamentoController');
const { Orcamento } = require('../models');
const gerarPDF = require('../utils/exportarPDF');
const path = require('path');
const fs = require('fs');

// Rota base já é /orcamentos no server.js
router.post('/', orcamentoController.create);
router.get('/', orcamentoController.listarOrcamentos);
router.get('/:id', orcamentoController.buscarOrcamentoPorId);
router.put('/:id', orcamentoController.atualizarOrcamento);
router.get('/:id/pdf', orcamentoController.exportarPDF);

// (Opcional) Rota alternativa para download do PDF
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const orcamento = await Orcamento.findByPk(id, {
      include: ['produtos', 'servicos']
    });

    if (!orcamento) return res.status(404).json({ message: 'Orçamento não encontrado' });

    const filePath = path.join(__dirname, `../temp/orcamento_${id}.pdf`);
    await gerarPDF(orcamento, filePath);

    res.download(filePath, `orcamento_${id}.pdf`, (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar PDF', error });
  }
});

module.exports = router;
