'use strict';
module.exports = (sequelize, DataTypes) => {
  const CreateEvents = sequelize.define(
    'CreateEvents',
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

  CreateEvents.associate = function (models) {
    CreateEvents.belongsTo(models.Users, { foreignKey: 'idUtente' });
    CreateEvents.belongsTo(models.Events, { foreignKey: 'idEvento' });
  };

  return CreateEvents;
};
