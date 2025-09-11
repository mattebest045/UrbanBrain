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
      titolo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { // Validazione per il tipo di evento
          isIn: [['All Events', 'Music', 'Food & Drink', 'Sport', 'Business', 'Community']],
        },

      },
      organizzatore: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailOrganizzatore: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
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
      postiDisponibili: {
        type: DataTypes.INTEGER,
      },
      descrizione: {
        type: DataTypes.TEXT,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false,
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
    Events.hasMany(models.JoinEvents, { foreignKey: 'idEvento', onDelete: 'CASCADE' });
    Events.hasMany(models.CreateEvents, { foreignKey: 'idEvento', onDelete: 'CASCADE' });
  };

  return Events;
};
