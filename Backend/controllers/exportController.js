// exportController.js - completo com exportações individuais e múltiplas
const { Cliente } = require('../models');

const { HistoricoFinanceiro } = require('../models');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');


exports.exportAllExcel = async (req, res) => {
    const ExcelJS = require('exceljs');
    const clientes = await Cliente.findAll();
  
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Clientes');
  
    sheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Nome', key: 'nome' },
      { header: 'Telefone', key: 'telefone' },
      { header: 'Endereço', key: 'endereco' },
      { header: 'Cliente Desde', key: 'cliente_desde' },
      { header: 'Situação', key: 'situacao' },
    ];
  
    clientes.forEach(cliente => {
      sheet.addRow(cliente.dataValues);
    });
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=clientes.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  };

  exports.exportAllPDF = async (req, res) => {
    const clientes = await Cliente.findAll();
  
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename=clientes.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
  
    doc.fontSize(16).text('Lista de Clientes', { align: 'center' }).moveDown();
  
    clientes.forEach((c, i) => {
      doc.fontSize(12).text(`ID: ${c.id}`);
      doc.text(`Nome: ${c.nome}`);
      doc.text(`Telefone: ${c.telefone}`);
      doc.text(`Endereço: ${c.endereco || '---'}`);
      doc.text(`Cliente Desde: ${c.cliente_desde}`);
      doc.text(`Situação: ${c.situacao}`);
      doc.text(`Bom Pagador: ${c.bom_pagador ? 'Sim' : 'Não'}`);
      doc.text(`CPF: ${c.cpf || '---'}`);
      doc.text(`Email: ${c.email || '---'}`);
      doc.moveDown();
    });
  
    doc.end();
  };
  
exports.exportHistoricoPDF = async (req, res) => {
  const { cliente_id } = req.params;
  const historico = await HistoricoFinanceiro.findAll({ where: { cliente_id } });

  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename=historico_cliente_' + cliente_id + '.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(16).text(`Histórico Financeiro do Cliente ${cliente_id}`, { align: 'center' }).moveDown();
  historico.forEach((h, i) => {
    doc.fontSize(12).text(`Mês: ${h.mes} | Ano: ${h.ano}`);
    doc.text(`Valor Pago: R$ ${h.valor_pago}`);
    doc.text(`Pago em Dia: ${h.pago_em_dia ? 'Sim' : 'Não'}`);
    doc.text(`Observação: ${h.observacao || '---'}`);
    doc.moveDown();
  });

  doc.end();
};

exports.exportHistoricoExcel = async (req, res) => {
  const { cliente_id } = req.params;
  const historico = await Historico.findAll({ where: { cliente_id } });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Histórico');

  sheet.columns = [
    { header: 'Mês', key: 'mes' },
    { header: 'Ano', key: 'ano' },
    { header: 'Valor Pago', key: 'valor_pago' },
    { header: 'Pago em Dia', key: 'pago_em_dia' },
    { header: 'Observação', key: 'observacao' },
  ];

  historico.forEach(h => {
    sheet.addRow({
      mes: h.mes,
      ano: h.ano,
      valor_pago: h.valor_pago,
      pago_em_dia: h.pago_em_dia ? 'Sim' : 'Não',
      observacao: h.observacao || '',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=historico_cliente_${cliente_id}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
};

exports.exportHistoricoPDFMultiplos = async (req, res) => {
    try {
      const { cliente_id } = req.params;
  
      const historico = await HistoricoFinanceiro.findAll({ where: { cliente_id } });
  
      // ... restante do código de exportação
    } catch (err) {
      console.error('Erro ao exportar múltiplos históricos:', err);
      res.status(500).json({ error: 'Erro ao exportar' });
    }
  };

exports.exportHistoricoExcelMultiplos = async (req, res) => {
  const { cliente_ids } = req.body;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Histórico Consolidado');

  sheet.columns = [
    { header: 'Cliente', key: 'cliente' },
    { header: 'Mês', key: 'mes' },
    { header: 'Ano', key: 'ano' },
    { header: 'Valor Pago', key: 'valor_pago' },
    { header: 'Pago em Dia', key: 'pago_em_dia' },
    { header: 'Observação', key: 'observacao' },
  ];

  for (const cliente_id of cliente_ids) {
    const cliente = await Cliente.findByPk(cliente_id);
    const historico = await Historico.findAll({ where: { cliente_id } });

    historico.forEach(h => {
      sheet.addRow({
        cliente: cliente.nome,
        mes: h.mes,
        ano: h.ano,
        valor_pago: h.valor_pago,
        pago_em_dia: h.pago_em_dia ? 'Sim' : 'Não',
        observacao: h.observacao || '',
      });
    });
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=historico_multiplos.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};
