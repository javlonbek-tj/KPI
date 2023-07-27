export default function DateModel(sequelize, Sequelize) {
  return sequelize.define('date', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: Sequelize.DataTypes.DATE,
      allowNul: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}
