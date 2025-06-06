'use strict';
module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define(
    'Events',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      luogo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      posti: {
        type: DataTypes.INTEGER,
      },
      descrizione: {
        type: DataTypes.TEXT,
      },
      data: {
        type: DataTypes.DATEONLY,
      },
      stato: {
        type: DataTypes.INTEGER,
        /**
         * 0: stato di attivazione
         * 1: attivo
         * 2: warning
         * 3: bannato
         */
        validate: {
          min: 0,
          max: 3,
        },
      },
    },
    {
      tableName: 'eventi',
      timestamps: true, // crea createdAt e updatedAt automaticamente
    }
  );

  Evento.associate = function (models) {
    Evento.hasMany(models.JoinEvent, { foreignKey: 'idEvento' });
    Evento.hasMany(models.CreateEvent, { foreignKey: 'idEvento' });
  };

  return Evento;
};
