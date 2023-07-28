export default function ExpiredTaskModel(sequelize, Sequelize) {
  return sequelize.define('expiredTask', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskNumber: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    organization: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    date: {
      type: Sequelize.DataTypes.DATE,
      allowNul: false,
    },
    status: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: 'Jarayonda',
      allowNull: false,
    }
  });
}
