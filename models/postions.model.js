export default function PositionModel(sequelize, Sequelize) {
  return sequelize.define('position', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
  });
}
