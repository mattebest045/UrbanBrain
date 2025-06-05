'use strict';
module.exports = (sequelize, DataTypes) => {
  const CreateEvent = sequelize.define(
    'CreateEvent',
    {
      idEvento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'eventi', // deve corrispondere al nome della tabella definita in Evento
          key: 'id',
        },
      },
      idUtente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'utenti', // deve corrispondere al nome della tabella definita in Utente
          key: 'id',
        },
      },
      segnalazione: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'creazione_evento',
      timestamps: true, // aggiunge createdAt e updatedAt
    }
  );

  CreateEvent.associate = function (models) {
    CreateEvent.belongsTo(models.Users, { foreignKey: 'idUtente' });
    CreateEvent.belongsTo(models.Events, { foreignKey: 'idEvento' });
  };

  return CreateEvent;
};
