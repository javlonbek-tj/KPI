import { Op } from 'sequelize';
import filtering from '../utils/filtering.js';
import { getMonth } from '../utils/formateDate.js';
import { formatDate } from '../utils/formateDate.js';

export let filteredUsers = [];

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

        let tasks;
        let latenesses;
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
          expiredTasks: filteredExpiredTasks,
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
        allEmployees
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
        include: [{model: req.db.users, include: req.db.department}]
      });
      const filteredLateness = latenesses.filter(late => {
          const lateDate = new Date(late.lateDay);
        return lateDate.getMonth() === currentMonth;
      });
      return res.render('latenesses', {
        pageTitle: `Kechikishlar`,
        latenesses: filteredLateness,
        formatDate
      });
    } catch (e) {
      next(e);
    }
  }

    async getExpiredTasks(req, res, next) {
    try {
      const currentMonth = new Date().getMonth();
      const expiredTasks = await req.db.expiredTasks.findAll({
        include: [{model: req.db.users, include: req.db.department}]
      });
      const filteredExpiredTasks = expiredTasks.filter(task => {
          const taskDate = new Date(task.date);
        return taskDate.getMonth() === currentMonth;
      });
      return res.render('expiredTasks', {
        pageTitle: `Muddat buzilishlar`,
        expiredTasks: filteredExpiredTasks,
        formatDate
      });
    } catch (e) {
      next(e);
    }
  }
}

export const homeController = new HomeController();