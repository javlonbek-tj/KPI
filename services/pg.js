import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import DepartmentModel from '../models/department.model.js';
import ExpiredTaskModel from '../models/expiredTask.model.js';
import PositionModel from '../models/postions.model.js';
import UsersModel from '../models/user.model.js';
import Relations from '../models/relation.js';
import DateModel from '../models/date.model.js';
import LatenessModel from '../models/lateness.model.js';

dotenv.config();

/* const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize(
  isProduction ? process.env.DB_NAME : process.env.DB_NAME_DEV,
  isProduction ? process.env.DB_USER : process.env.DB_USER_DEV,
  isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV,
  {
    dialect: 'postgres',
    host: isProduction ? process.env.DB_HOST : process.env.DB_HOST_DEV,
    logging: false,
  }
); */


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    logging: false,
  }
);


export default async function pg() {
  try {
    await sequelize.authenticate();

      console.log('Database connection has been established successfully.');
      
    // create database object
    let db = {};
    db.users = await UsersModel(sequelize, Sequelize);
    db.department = await DepartmentModel(sequelize, Sequelize);
    db.position = await PositionModel(sequelize, Sequelize);
    db.expiredTasks = await ExpiredTaskModel(sequelize, Sequelize);
    db.lateness = await LatenessModel(sequelize, Sequelize);
    db.date = await DateModel(sequelize, Sequelize);

    await Relations(db);
    return db;
  } catch (err) {
    console.log(err);
  }
}
