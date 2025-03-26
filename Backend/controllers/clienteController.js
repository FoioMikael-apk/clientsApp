// controllers/clienteController.js
const { Cliente } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

exports.create = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    await cliente.update(req.body);
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};
