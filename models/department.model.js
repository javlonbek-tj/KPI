export default function DepartmentModel(sequelize, Sequelize) {
  return sequelize.define('department', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    numberOfEmployees: {
      type: Sequelize.DataTypes.INTEGER,
      allowNul: false,
    },
    vacancy: {
      type: Sequelize.DataTypes.INTEGER,
      allowNul: false,
      defaultValue: 0,
    },
  });
}
