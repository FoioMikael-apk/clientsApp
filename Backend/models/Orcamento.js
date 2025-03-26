module.exports = (sequelize, DataTypes) => {
    const Orcamento = sequelize.define('Orcamento', {
      empresa_nome: DataTypes.STRING,
      empresa_cnpj: DataTypes.STRING,
      empresa_endereco: DataTypes.STRING,
      empresa_telefone: DataTypes.STRING,
      cliente_nome: DataTypes.STRING,
      cliente_endereco: DataTypes.STRING,
      cliente_documento: DataTypes.STRING,
      cliente_email: DataTypes.STRING,
      tecnico: DataTypes.STRING,
      data_emissao: DataTypes.DATEONLY,
      validade: DataTypes.DATEONLY,
      total: DataTypes.DECIMAL(10, 2)
    });
  
    Orcamento.associate = models => {
      if (models.ProdutoOrcamento)
        Orcamento.hasMany(models.ProdutoOrcamento, { foreignKey: 'orcamento_id', as: 'produtos' });
  
      if (models.ServicoOrcamento)
        Orcamento.hasMany(models.ServicoOrcamento, { foreignKey: 'orcamento_id', as: 'servicos' });
    };
  
    return Orcamento;
  };
  