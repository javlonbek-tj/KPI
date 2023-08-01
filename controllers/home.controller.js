import { Op } from 'sequelize';
import filtering from '../utils/filtering.js';
import { getMonth } from '../utils/formateDate.js';
import { formatDate } from '../utils/formateDate.js';

export let filteredUsers = [];
export let tasks = [];
export let filteredDepartments = [];
export let filteredLatenesses = [];

class HomeController {
  async homePage(req, res, next) {
    try {
      const { department, position, users, expiredTasks, date, lateness } = req.db;
      const departments = await department.findAll({ raw: true });
      const positions = await position.findAll({ raw: true });

      const page = parseInt(req.query.page) || 1;
      const limit = 9;
      const { search, departmentId, fullname, from, to } = req.query;
      const offset = (Math.abs(page) - 1) * Math.abs(limit);

      let whereClause = {};

      if (search) {
        whereClause = {
          [Op.or]: [
            { firstname: { [Op.iLike]: `%${search}%` } },
            { secondname: { [Op.iLike]: `%${search}%` } },
            { lastname: { [Op.iLike]: `%${search}%` } },
          ],
        };
      } else if (departmentId || fullname || from || to) {
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;
        whereClause = filtering(departmentId, fullname, fromDate, toDate);
      } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        whereClause = {
          '$dates.date$': {
            [Op.and]: [
              { [Op.gte]: new Date(currentYear, currentMonth, 1) },
              { [Op.lte]: new Date(currentYear, currentMonth + 1, 0) },
            ],
          },
        };
      }
      const { rows, count } = await users.findAndCountAll({
        where: whereClause,
        include: [
          { model: department },
          { model: expiredTasks },
          { model: lateness },
          { model: position },
          { model: date },
        ],
        subQuery: false,
      });
      const currentMonth = new Date().getMonth();
      const allEmployees = rows.map(employee => {
        const formattedDates = employee.dates.map(date => ({
          ...date.toJSON(),
          date: getMonth(date.date),
        }));
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        const expiredTasksCount = employee.expiredTasks.length;
        const expiredTasksPunishment = expiredTasksCount;

        // Calculate punishment based on lateness entries for the current month
        const latenessPunishment = employee.latenesses.reduce((totalPunishment, late) => {
          const lateDate = new Date(late.lateDay);
          const lateMonth = lateDate.getMonth();
          if (
            (!fromDate || lateDate >= fromDate) &&
            (!toDate || (lateDate <= toDate && (fromDate || toDate || lateMonth == currentMonth)))
          ) {
            return totalPunishment + parseInt(late.lateTime) * 0.5;
          } else {
            return totalPunishment;
          }
        }, 0);

        // Total punishment for the user
        const totalPunishment = expiredTasksPunishment + latenessPunishment;

        const filteredExpiredTasks = employee.expiredTasks.filter(task => {
          const taskDate = new Date(task.date);
          if (fromDate && toDate) {
            return taskDate >= fromDate && taskDate <= toDate;
          } else if (fromDate) {
            return taskDate >= fromDate;
          } else if (toDate) {
            return taskDate <= toDate;
          } else {
            return taskDate.getMonth() === currentMonth;
          }
        });

        const tasksInProcess = filteredExpiredTasks.filter(task => task.status === 'Jarayonda');
        const tasksFinished = filteredExpiredTasks.filter(task => task.status === 'Yakunlangan');

        const filteredLateness = employee.latenesses.filter(late => {
          const lateDate = new Date(late.lateDay);
          if (fromDate && toDate) {
            return lateDate >= fromDate && lateDate <= toDate;
          } else if (fromDate) {
            return lateDate >= fromDate;
          } else if (toDate) {
            return lateDate <= toDate;
          } else {
            return lateDate.getMonth() === currentMonth;
          }
        });

        return {
          ...employee.toJSON(),
          dates: formattedDates,
          tasksInProcess,
          tasksFinished,
          latenesses: filteredLateness,
          punishment: totalPunishment,
        };
      });

      filteredUsers.pop();
      filteredUsers.push(allEmployees);

      const paginatedEmployees = allEmployees.slice(offset, offset + limit);
      const isOverLimit = count > limit;
      return res.render('home', {
        pageTitle: 'Davlat kadastrlari palatasi',
        departments,
        positions,
        employees: paginatedEmployees,
        isOverLimit,
        currentPage: page,
        hasNextPage: limit * page < count,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(count / limit),
        total: count,
        limit,
        query: req.query,
        allEmployees,
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { departmentId } = req.query;
      const users = await req.db.users.findAll({ where: { departmentId } });
      return res.json({
        users,
      });
    } catch (e) {
      next(e);
    }
  }

  async getDepartments(req, res, next) {
    try {
      const departments = await req.db.department.findAll({
        include: [
          {
            model: req.db.users,
            include: req.db.position,
          },
        ],
      });
      return res.render('departments', {
        pageTitle: `Bo'limlar`,
        departments,
      });
    } catch (e) {
      next(e);
    }
  }

  async getLatenesses(req, res, next) {
    try {
      const currentMonth = new Date().getMonth();
      const latenesses = await req.db.lateness.findAll({
        include: [{ model: req.db.users, include: req.db.department }],
      });
      const filteredLateness = latenesses.filter(late => {
        const lateDate = new Date(late.lateDay);
        return lateDate.getMonth() === currentMonth;
      });
      filteredLatenesses.pop();
      filteredLatenesses.push(filteredLateness);
      return res.render('latenesses', {
        pageTitle: `Kechikishlar`,
        latenesses: filteredLateness,
        formatDate,
      });
    } catch (e) {
      next(e);
    }
  }

  async getExpiredTasks(req, res, next) {
    try {
      const currentMonth = new Date().getMonth();
      const expiredTasks = await req.db.expiredTasks.findAll({
        include: [{ model: req.db.users, include: req.db.department }],
      });
      const filteredExpiredTasks = expiredTasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getMonth() === currentMonth;
      });
      const currentExpiredTasks = filteredExpiredTasks.filter(task => task.status === 'Jarayonda');
      tasks.pop();
      tasks.push(currentExpiredTasks);
      return res.render('expiredTasks', {
        pageTitle: `Muddat buzilishlar`,
        expiredTasks: currentExpiredTasks,
        formatDate,
      });
    } catch (e) {
      next(e);
    }
  }

  async home2Page(req, res, next) {
    try {
      const { department, position, users, expiredTasks, date, lateness } = req.db;
      const departments = await department.findAll({ raw: true });
      const positions = await position.findAll({ raw: true });

      const page = parseInt(req.query.page) || 1;
      const limit = 13;
      const { departmentId, fullname, from, to } = req.query;
      const offset = (Math.abs(page) - 1) * Math.abs(limit);

      let whereClause = {};

      if (departmentId || fullname || from || to) {
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;
        whereClause = filtering(departmentId, fullname, fromDate, toDate);
      }
      const { rows } = await users.findAndCountAll({
        where: whereClause,
        include: [
          { model: department },
          { model: expiredTasks },
          { model: lateness },
          { model: position },
          { model: date },
        ],
        subQuery: false,
      });
      const currentMonth = new Date().getMonth();
      const allEmployees = rows.map(employee => {
        const formattedDates = employee.dates.map(date => ({
          ...date.toJSON(),
          date: getMonth(date.date),
        }));
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        const expiredTasksCount = employee.expiredTasks.length;
        const expiredTasksPunishment = expiredTasksCount;

        // Calculate punishment based on lateness entries
        const latenessPunishment = employee.latenesses.reduce(
          (totalPunishment, late) => totalPunishment + parseInt(late.lateTime) * 0.5,
          0,
        );
        // Total punishment for the user
        const totalPunishment = expiredTasksPunishment + latenessPunishment;

        const filteredExpiredTasks = employee.expiredTasks.filter(task => {
          const taskDate = new Date(task.date);
          if (fromDate && toDate) {
            return taskDate >= fromDate && taskDate <= toDate;
          } else if (fromDate) {
            return taskDate >= fromDate;
          } else if (toDate) {
            return taskDate <= toDate;
          } else {
            return taskDate.getMonth() === currentMonth;
          }
        });

        const tasksInProcess = filteredExpiredTasks.filter(task => task.status === 'Jarayonda');
        const tasksFinished = filteredExpiredTasks.filter(task => task.status === 'Yakunlangan');

        const filteredLateness = employee.latenesses.filter(late => {
          const lateDate = new Date(late.lateDay);
          if (fromDate && toDate) {
            return lateDate >= fromDate && lateDate <= toDate;
          } else if (fromDate) {
            return lateDate >= fromDate;
          } else if (toDate) {
            return lateDate <= toDate;
          } else {
            return lateDate.getMonth() === currentMonth;
          }
        });
        return {
          ...employee.toJSON(),
          dates: formattedDates,
          tasksInProcess,
          tasksFinished,
          latenesses: filteredLateness,
          punishment: totalPunishment,
        };
      });

      const groupedDepartments = {};

      allEmployees.forEach(employee => {
        const { department } = employee;

        if (department && department.name) {
          if (!groupedDepartments[department.name]) {
            groupedDepartments[department.name] = {
              department: department.name,
              departmentId: department.id,
              employees: [],
              tasksInProcess: [],
              tasksFinished: [],
              latenesses: [],
              dates: [],
            };
          }

          groupedDepartments[department.name].tasksInProcess.push(...employee.tasksInProcess);
          groupedDepartments[department.name].tasksFinished.push(...employee.tasksFinished);

          groupedDepartments[department.name].employees.push(employee);
          groupedDepartments[department.name].dates.push(...employee.dates);
          groupedDepartments[department.name].latenesses.push(...employee.latenesses);
        }
      });
      const allGroupedDepartments = Object.values(groupedDepartments);
      filteredDepartments.pop();
      filteredDepartments.push(allGroupedDepartments);
      const count = allGroupedDepartments.length;
      const paginatedGroupedDepartments = allGroupedDepartments.slice(offset, offset + limit);
      const isOverLimit = count > limit;
      return res.render('home2', {
        pageTitle: 'Davlat kadastrlari palatasi',
        departments,
        positions,
        isOverLimit,
        currentPage: page,
        hasNextPage: limit * page < count,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(count / limit),
        total: count,
        limit,
        query: req.query,
        allEmployees,
        groupedDepartments: paginatedGroupedDepartments,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const homeController = new HomeController();
