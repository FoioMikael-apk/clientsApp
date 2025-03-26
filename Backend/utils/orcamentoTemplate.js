const gerarHTML = require('../utils/orcamentoTemplate');
const pdf = require('html-pdf'); // ou puppeteer

exports.exportarPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const orcamento = await Orcamento.findByPk(id, {
      include: ['produtos', 'servicos'],
    });

    if (!orcamento) return res.status(404).json({ message: 'Orçamento não encontrado' });

    const html = gerarHTML(orcamento);

    pdf.create(html).toStream((err, stream) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao gerar PDF');
      }
      res.setHeader('Content-Type', 'application/pdf');
      stream.pipe(res);
    });

  } catch (err) {
    console.error('Erro ao exportar PDF:', err);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};
