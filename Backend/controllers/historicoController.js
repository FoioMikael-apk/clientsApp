const HistoricoFinanceiro = require('../models/HistoricoFinanceiro');

exports.getByCliente = async (req, res) => {
  const { cliente_id } = req.params;
  const historico = await HistoricoFinanceiro.findAll({ where: { cliente_id } });
  res.json(historico);
};

exports.create = async (req, res) => {
  const novo = await HistoricoFinanceiro.create(req.body);
  res.json(novo);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await HistoricoFinanceiro.update(req.body, { where: { id } });
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await HistoricoFinanceiro.destroy({ where: { id } });
  res.json({ message: 'Removido com sucesso' });
};
