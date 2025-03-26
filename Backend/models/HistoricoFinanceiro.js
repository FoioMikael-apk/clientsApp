// models/HistoricoFinanceiro.js
module.exports = (sequelize, DataTypes) => {
    const HistoricoFinanceiro = sequelize.define('HistoricoFinanceiro', {
      cliente_id: DataTypes.INTEGER,
      mes: DataTypes.STRING,
      ano: DataTypes.STRING,
      valor_pago: DataTypes.DECIMAL(10, 2),
      bom_pagador: DataTypes.BOOLEAN,
    }, {
      tableName: 'HistoricoFinanceiros', // garante que o Sequelize use o nome correto da tabela
      timestamps: false // evita erros com createdAt/updatedAt
    });
  
    HistoricoFinanceiro.associate = models => {
      HistoricoFinanceiro.belongsTo(models.Cliente, {
        foreignKey: 'cliente_id',
        as: 'cliente'
      });
    };
  
    return HistoricoFinanceiro;
  };
  