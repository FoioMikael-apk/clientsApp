module.exports = (sequelize, DataTypes) => {
    const ServicoOrcamento = sequelize.define('ServicoOrcamento', {
      orcamento_id: DataTypes.INTEGER,
      qtde: DataTypes.DECIMAL(10, 2),
      descricao: DataTypes.STRING,
      valor: DataTypes.DECIMAL(10, 2)
    });
  
    ServicoOrcamento.associate = models => {
      if (models.Orcamento)
        ServicoOrcamento.belongsTo(models.Orcamento, { foreignKey: 'orcamento_id' });
    };
  
    return ServicoOrcamento;
  };
  