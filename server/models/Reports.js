'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      idSegnalazione: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idUtente: {
        type: DataTypes.INTEGER,
        references: {
          model: 'utenti',
          key: 'id',
        },
      },
      citta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      indirizzo: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.DATEONLY,
      },
      descrizione: {
        type: DataTypes.TEXT,
      },
      foto: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'segnalazioni',
      timestamps: true, // aggiunge createdAt e updatedAt
    }
  );

  Reports.associate = function (models) {
    Reports.belongsTo(models.Users, { foreignKey: 'idUtente' });
  };

  return Reports;
};
