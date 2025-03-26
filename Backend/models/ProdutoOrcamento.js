module.exports = (sequelize, DataTypes) => {
    const ProdutoOrcamento = sequelize.define('ProdutoOrcamento', {
      orcamento_id: DataTypes.INTEGER,
      qtde: DataTypes.DECIMAL(10, 2),
      descricao: DataTypes.STRING,
      valor: DataTypes.DECIMAL(10, 2)
    });
  
    ProdutoOrcamento.associate = models => {
      if (models.Orcamento)
        ProdutoOrcamento.belongsTo(models.Orcamento, { foreignKey: 'orcamento_id' });
    };
  
    return ProdutoOrcamento;
  };