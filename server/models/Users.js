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
      dataNascita: {
        type: DataTypes.DATEONLY,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      telefono: {
        type: DataTypes.STRING,
        unique: true,
      },
      indirizzo: {
        type: DataTypes.STRING,
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
    Utente.hasMany(models.JoinEvent, { foreignKey: 'idUtente' });
    Utente.hasMany(models.CreateEvent, { foreignKey: 'idUtente' });
    Utente.hasMany(models.Reports, { foreignKey: 'idUtente' });
  };

  return Utente;
};
