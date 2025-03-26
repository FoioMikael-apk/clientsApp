// models/Cliente.js
module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
      nome: DataTypes.STRING,
      telefone: DataTypes.STRING,
      endereco: DataTypes.STRING,
      cliente_desde: DataTypes.STRING,
      situacao: DataTypes.STRING,
      bom_pagador: DataTypes.BOOLEAN,
      cpf: DataTypes.STRING,
      email: DataTypes.STRING,
    }, {
      timestamps: false // <--- ISSO AQUI
    });
  
    return Cliente;
  };
  