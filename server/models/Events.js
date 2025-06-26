'use strict';
module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define(
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
      prezzo: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00,
      },
      filename: {
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.STRING,
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

  Events.associate = function (models) {
    Events.hasMany(models.JoinEvents, { foreignKey: 'idEvents' });
    Events.hasMany(models.CreateEvents, { foreignKey: 'idEvents' });
  };

  return Events;
};
