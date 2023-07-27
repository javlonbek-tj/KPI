export default function UsersModel(sequelize, Sequelize) {
  return sequelize.define('user', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    secondname: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    lastname: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    login: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    photo: {
      type: Sequelize.DataTypes.STRING,
    },
    role: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    resume: {
        type: Sequelize.DataTypes.STRING,
      },
    fullname: {
      type: Sequelize.DataTypes.VIRTUAL,
      get() {
        return `${this.firstname} ${this.secondname} ${this.lastname}`;
      },
    },
  });
}
