'use strict';
module.exports = (sequelize, DataTypes) => {
  const JoinEvent = sequelize.define(
    'JoinEvent',
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
      foto: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'partecipa_evento',
      timestamps: true,
    }
  );

  JoinEvent.associate = function (models) {
    JoinEvent.belongsTo(models.Users, { foreignKey: 'idUtente' });
    JoinEvent.belongsTo(models.Events, { foreignKey: 'idEvento' });
  };

  return JoinEvent;
};
