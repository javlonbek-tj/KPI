export default function LatenessModel(sequelize, Sequelize) {
  return sequelize.define('lateness', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lateDay: {
      type: Sequelize.DataTypes.DATE,
      allowNul: false,
    },
    lateTime: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    explanationLetter: {
      type: Sequelize.DataTypes.STRING,
      allowNul: true,
    },
  });
}
