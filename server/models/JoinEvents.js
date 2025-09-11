'use strict';
module.exports = (sequelize, DataTypes) => {
  const JoinEvents = sequelize.define(
    'JoinEvents',
    {
      idEvento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'eventi',
          key: 'id',
        },
      },
      idUtente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'utenti',
          key: 'id',
        },
      },
      segnalazione: {
        type: DataTypes.TEXT,
      },
      star: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 5,
        },
      },
      descrizione: {
        type: DataTypes.TEXT,
      },
      stato: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Default to 'Inactive'
        validate: {
          isIn: [[0, 1, 2, 3]], // Valid states: Inactive, Active, Queue, Banned
        },
      }
    },
    {
      tableName: 'partecipa_evento',
      timestamps: true,
    }
  );

  JoinEvents.associate = function (models) {
    JoinEvents.belongsTo(models.Users, { foreignKey: 'idUtente', targetKey: 'id', onDelete: 'CASCADE' });
    JoinEvents.belongsTo(models.Events, { foreignKey: 'idEvento', targetKey: 'id', onDelete: 'CASCADE' });
  };

  return JoinEvents;
};
