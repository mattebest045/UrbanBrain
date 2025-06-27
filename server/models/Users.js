'use strict';
module.exports = (sequelize, DataTypes) => {
  const Utente = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cognome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      luogo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      stato: {
        /**
         * 0: stato di attivazione
         * 1: attivo
         * 2: warning
         * 3: bannato
         */
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 3,
        },
      },
    },
    {
      tableName: 'utenti',
      timestamps: true, // gestisce createdAt e updatedAt automaticamente
    }
  );

  Utente.associate = function (models) {
    Utente.hasMany(models.JoinEvents, { foreignKey: 'idUtente' });
    Utente.hasMany(models.CreateEvents, { foreignKey: 'idUtente' });
    Utente.hasMany(models.Reports, { foreignKey: 'idUtente' });
  };

  return Utente;
};
