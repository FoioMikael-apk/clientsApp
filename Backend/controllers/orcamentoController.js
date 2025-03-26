const { Orcamento, ProdutoOrcamento, ServicoOrcamento } = require('../models');
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');
const { format } = require('date-fns');

const create = async (req, res) => {
  try {
    const {
      empresa_nome,
      empresa_cnpj,
      empresa_endereco,
      empresa_telefone,
      cliente_nome,
      cliente_endereco,
      cliente_documento,
      cliente_email,
      tecnico,
      data_emissao,
      validade,
      produtos,
      servicos,
      total
    } = req.body;

    const orcamento = await Orcamento.create({
      empresa_nome,
      empresa_cnpj,
      empresa_endereco,
      empresa_telefone,
      cliente_nome,
      cliente_endereco,
      cliente_documento,
      cliente_email,
      tecnico,
      data_emissao,
      validade,
      total
    });

    if (produtos?.length) {
      for (const produto of produtos) {
        await ProdutoOrcamento.create({
          ...produto,
          orcamento_id: orcamento.id
        });
      }
    }

    if (servicos?.length) {
      for (const servico of servicos) {
        await ServicoOrcamento.create({
          ...servico,
          orcamento_id: orcamento.id
        });
      }
    }

    res.status(201).json({ message: 'Orçamento criado com sucesso!', orcamento });

  } catch (err) {
    console.error('Erro ao salvar orçamento:', err);
    res.status(500).json({ error: 'Erro interno ao salvar orçamento.' });
  }
};

const listarOrcamentos = async (req, res) => {
  try {
    const orcamentos = await Orcamento.findAll({
      include: ['produtos', 'servicos']
    });
    res.json(orcamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar orçamentos', error });
  }
};

const buscarOrcamentoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const orcamento = await Orcamento.findByPk(id, {
      include: ['produtos', 'servicos']
    });
    if (!orcamento) return res.status(404).json({ message: 'Orçamento não encontrado' });
    res.json(orcamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar orçamento', error });
  }
};

const atualizarOrcamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { produtos, servicos, ...dadosOrcamento } = req.body;

    const orcamento = await Orcamento.findByPk(id);
    if (!orcamento) return res.status(404).json({ message: 'Orçamento não encontrado' });

    await orcamento.update(dadosOrcamento);

    await ProdutoOrcamento.destroy({ where: { orcamento_id: id } });
    await ServicoOrcamento.destroy({ where: { orcamento_id: id } });

    for (const p of produtos) {
      await ProdutoOrcamento.create({ ...p, orcamento_id: id });
    }

    for (const s of servicos) {
      await ServicoOrcamento.create({ ...s, orcamento_id: id });
    }

    res.json(orcamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar orçamento', error });
  }
};

const exportarPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const orcamento = await Orcamento.findByPk(id, {
      include: ['produtos', 'servicos']
    });

    if (!orcamento) return res.status(404).json({ message: 'Orçamento não encontrado' });

    const templatePath = path.join(__dirname, '../templates/orcamentoTemplate.ejs');

    const html = await ejs.renderFile(templatePath, {
      orcamento,
      data_emissao: format(new Date(orcamento.data_emissao), 'dd/MM/yyyy'),
      validade: format(new Date(orcamento.validade), 'dd/MM/yyyy')
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=orcamento_${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({ message: 'Erro ao gerar PDF' });
  }
};

module.exports = {
  create,
  listarOrcamentos,
  buscarOrcamentoPorId,
  atualizarOrcamento,
  exportarPDF,
};
