const express = require('express');
const cors = require('cors');
const db = require('./models');
const sequelize = db.sequelize;

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/clientes', require('./routes/clienteRoutes'));
app.use('/clientes/export', require('./routes/exportRoutes'));
app.use('/historico', require('./routes/historicoRoutes'));
app.use('/orcamentos', require('./routes/orcamentoRoutes')); // aqui deve estar corretamente

// Iniciar servidor
sequelize.sync().then(() => {
  app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
});
