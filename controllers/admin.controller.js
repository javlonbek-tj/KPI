import adminService from '../services/admin.service.js';
import { filteredUsers, tasks, filteredDepartments, filteredLatenesses } from './home.controller.js';


class AdminController {
  async getRegister(req, res, next) {
    try {
      await adminService.getAddEmployee(req, res);
    } catch (e) {
      next(e);
    }
  }

  async postRegister(req, res, next) {
    try {
      const { firstname, secondname, lastname, login, password, positionId, departmentId, role } = req.body;
      await adminService.adminAddEmployee(
        req,
        res,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
      );
    } catch (e) {
      next(e);
    }
  }

  async getAddPositionPage(req, res, next) {
    try {
      await adminService.getAddPosition(req, res);
    } catch (e) {
      next(e);
    }
  }

  async postAddPosition(req, res, next) {
    try {
      const { position } = req.body;
      await adminService.adminAddPosition(req, res, position);
    } catch (e) {
      next(e);
    }
  }

  async getAddDepartmentPage(req, res, next) {
    try {
      await adminService.getAddDepartment(req, res);
    } catch (e) {
      next(e);
    }
  }

  async postAddDepartment(req, res, next) {
    try {
      let { department, numberOfEmployees, vacancy } = req.body;
      numberOfEmployees = parseInt(numberOfEmployees);
      vacancy = parseInt(vacancy);
      await adminService.adminAddDepartment(req, res, department, numberOfEmployees, vacancy);
    } catch (e) {
      next(e);
    }
  }

  async oneEmployee(req, res, next) {
    try {
      const { employeeId } = req.params;
      await adminService.getOneEmployee(employeeId, req, res);
    } catch (e) {
      next(e);
    }
  }
  async latenessPage(req, res, next) {
    try {
      const { employeeId } = req.params;
      await adminService.getLatenessPage(employeeId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async postAddLateness(req, res, next) {
    try {
      const explanationLetter = req.file?.path || '';
      const { employeeId, lateDay, lateTime } = req.body;
      await adminService.addLateness(employeeId, req, res, lateDay, lateTime, explanationLetter);
    } catch (e) {
      next(e);
    }
  }

  async getExpiredTask(req, res, next) {
    try {
      const { employeeId } = req.params;
      await adminService.getExpiredTaskPage(employeeId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async postAddExpiredTask(req, res, next) {
    try {
      const { employeeId, taskNumber, organization, date } = req.body;
      await adminService.addExpiredTask(employeeId, req, res, taskNumber, organization, date);
    } catch (e) {
      next(e);
    }
  }

  async updatePositon(req, res, next) {
    try {
      const { positionId, position } = req.body;
      await adminService.updatePosition(positionId, req, res, position);
    } catch (e) {
      next(e);
    }
  }

  async updateDepartment(req, res, next) {
    try {
      const { departmentId, department, numberOfEmployees, vacancy } = req.body;
      await adminService.updateDepartment(req, res, departmentId, department, numberOfEmployees, vacancy);
    } catch (e) {
      next(e);
    }
  }

  async deleteExpirationLetter(req, res, next) {
    try {
      const { taskId } = req.body;
      await adminService.deleteExpiredTask(taskId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async deleteLateness(req, res, next) {
    try {
      const { latenessId } = req.body;
      await adminService.deleteLateness(latenessId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async getUpdateLatenessPage(req, res, next) {
    try {
      const latenessId = req.params.latenessId.split('-')[0];
      const employeeId = req.params.latenessId.split('-')[1];
      await adminService.updateLatenessPage(employeeId, latenessId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async getUpdateExpiredTaskPage(req, res, next) {
    try {
      const letterId = req.params.letterId.split('-')[0];
      const employeeId = req.params.letterId.split('-')[1];
      await adminService.updateExpiredTaskPage(employeeId, letterId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async getUpdateEmployeePage(req, res, next) {
    try {
      const { employeeId } = req.params;
      await adminService.updateEmployeePage(employeeId, req, res);
    } catch (e) {
      next(e);
    }
  }

  async postUpdateLateness(req, res, next) {
    try {
      const { employeeId, latenessId, lateDay, lateTime} = req.body;
      await adminService.updateLateness(
        employeeId,
        latenessId,
        req,
        res,
        lateDay,
        lateTime,
      );
    } catch (e) {
      next(e);
    }
  }

  async postUpdateExpiredTask(req, res, next) {
    try {
      const { employeeId, expiredTaskId, taskNumber, organization, date, status } = req.body;
      await adminService.updateExpiredLetter(
        employeeId,
        expiredTaskId,
        req,
        res,
        taskNumber,
        organization,
        date,
        status
      );
    } catch (e) {
      next(e);
    }
  }
  async updateEmployee(req, res, next) {
    try {
      const {
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
        employeeId,
      } = req.body;
      await adminService.adminUpdateEmployee(
        req,
        res,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
        employeeId,
      );
    } catch (e) {
      next(e);
    }
  }

  async downloadExcel(req, res, next) {
    try {
      const workbook = await adminService.getUserExcel(filteredUsers);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Xodimlar.xlsx`);

      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (e) {
      next(e);
    }
  }

  async downloadByDepartments(req, res, next) {
    try {
      const workbook = await adminService.getExcelByDepartments(filteredDepartments);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Bo\'limlar.xlsx`);

      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (e) {
      next(e);
    }
  }
  async downloadTasksExcel(req, res, next) {
    try {
      const workbook = await adminService.getExpiredTasksExcel(tasks);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Xatlar.xlsx`);

      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (e) {
      next(e);
    }
  }

  async downloadLatenessExcel(req, res, next) {
    try {
      const workbook = await adminService.getLatenessExcel(filteredLatenesses);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Kechikishlar.xlsx`);

      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new AdminController();
