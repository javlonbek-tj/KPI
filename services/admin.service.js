import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import excelJS from 'exceljs';
import { getMonth } from '../utils/formateDate.js';
import { formatDate } from '../utils/formateDate.js';
import {deleteFile, deleteImages, getImageUrl} from '../utils/file.js';

const renderAddEmployee = async (
  req,
  res,
  errorMessage = '',
  error = '',
  update = '',
  firstname = '',
  secondname = '',
  lastname = '',
  login = '',
  password = '',
  positionId = '',
  departmentId = '',
  role = '',
  id = '',
) => {
  const departments = await req.db.department.findAll();
  const positions = await req.db.position.findAll();
  return res.render('admin/addEmployee', {
    pageTitle: "Qo'shish",
    departments,
    positions,
    errorMessage,
    error,
    update,
    employee: {
      firstname,
      secondname,
      lastname,
      login,
      password,
      positionId,
      departmentId,
      role,
      id,
    },
  });
};

const renderAddPosition = async (req, res, errorMessage = '', position = '') => {
  const positions = await req.db?.position.findAll();
  return res.render('admin/addPosition', {
    pageTitle: `Lavozim qo'shish`,
    positions,
    errorMessage,
    position,
  });
};

const renderAddDepartment = async (
  req,
  res,
  errorMessage = '',
  error = '',
  name = '',
  numberOfEmployees = '',
  vacancy = '',
) => {
  const departments = await req.db.department.findAll();
  return res.render('admin/addDepartment', {
    pageTitle: `Bo'lim qo'shish`,
    departments,
    numberOfEmployees,
    vacancy,
    errorMessage,
    error,
    name,
  });
};

const renderLateness = async (
  id,
  req,
  res,
  errorMessage = '',
  error = '',
  update = '',
  lateDay = '',
  lateTime = '',
  latenessId = '',
  formatDate = '',
) => {
  const employee = await req.db.users.findOne({ where: { id } });
  return res.render('admin/addLateInfo', {
    pageTitle: 'Kechikishni kiritish',
    employee,
    error,
    update,
    errorMessage,
    lateDay,
    lateTime,
    latenessId,
    formatDate,
  });
};

const renderExpiredTask = async (
  id,
  req,
  res,
  errorMessage = '',
  error = '',
  update = '',
  date = '',
  taskNumber = '',
  organization = '',
  expiredTaskId = '',
  formatDate = '',
) => {
  const employee = await req.db.users.findOne({ where: { id } });
  return res.render('admin/addletterControl', {
    pageTitle: 'Muddat buzilish',
    employee,
    error,
    update,
    errorMessage,
    date,
    taskNumber,
    organization,
    expiredTaskId,
    formatDate,
  });
};

class AdminService {
  async getAddEmployee(req, res) {
    await renderAddEmployee(req, res);
  }

  async adminAddEmployee(
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
  ) {
    const errors = validationResult(req);
    const images = req.files;
    if (!errors.isEmpty()) {
      if(images?.userPhoto || images?.resume) {
        deleteImages(images);
      }
      const errorMessage = errors.array()[0].msg;
      return renderAddEmployee(
        req,
        res,
        errorMessage,
        true,
        false,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
      );
    }
    const user = await req.db.users.findOne({ where: { login } });
    if (user) {
        if(images?.userPhoto || images?.resume) {
        deleteImages(images);
      }
      return renderAddEmployee(
        req,
        res,
        'Ushbu login band',
        true,
        false,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
      );
    }
    const candidate = await req.db.users.findOne({ where: { firstname, secondname, lastname } });
    if (candidate) {
        if(images?.userPhoto || images?.resume) {
        deleteImages(images);
      }
      return renderAddEmployee(
        res,
        'Ushbu xodim oldin kiritilgan',
        true,
        false,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
      );
    }
    let photo;
    let resume;
    if(images?.userPhoto && images.userPhoto[0].path) {
      photo = images.userPhoto[0].path;
    }
    if(images?.resume && images.resume[0].path) {
      resume = images.resume[0].path;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const highestExistingId = await req.db.users.max('id');
    const newId = highestExistingId + 1;
    const employee = await req.db.users.create({
      id: newId,
      firstname,
      secondname,
      lastname,
      login,
      password: hashPassword,
      photo,
      positionId,
      departmentId,
      role,
      resume
    });
    const highestExistingDateId = await req.db.date.max('id');
    const newDateId = highestExistingDateId + 1;
    await req.db.date.create({
      id: newDateId,
      date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ashgabat' }),
      userId: employee.id,
    });
    return res.redirect('/');
  }

  async getAddPosition(req, res) {
    await renderAddPosition(req, res);
  }

  async adminAddPosition(req, res, name) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return renderAddPosition(req, res, errorMessage);
    }
    const position = await req.db?.position.findOne({ where: { name } });
    if (position) {
      return renderAddPosition(req, res, 'Ushbu lavozim oldin kiritilgan');
    }
    const highestExistingPositionId = await req.db.position.max('id');
    const newPositionId = highestExistingPositionId + 1;
    await req.db.position.create({
      id: newPositionId,
      name,
    });
    return res.redirect('/admin/addPosition');
  }

  async getAddDepartment(req, res) {
    await renderAddDepartment(req, res);
  }

  async adminAddDepartment(req, res, name, numberOfEmployees, vacancy) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return renderAddDepartment(req, res, errorMessage, true, name, numberOfEmployees, vacancy);
    }
    const department = await req.db.department.findOne({ where: { name } });
    if (department) {
      return renderAddDepartment(
        req,
        res,
        `Ushbu bo'lim oldin kiritilgan`,
        true,
        department,
        numberOfEmployees,
        vacancy,
      );
    }
    const highestExistingDepartmentId = await req.db.department.max('id');
    const newDepartmentId = highestExistingDepartmentId + 1;
    await req.db.department.create({
      id: newDepartmentId,
      name,
      numberOfEmployees,
      vacancy,
    });
    return res.redirect('/admin/addDepartment');
  }

  async getOneEmployee(id, req, res) {
    const employee = await req.db.users.findOne({
      where: { id },
      include: [req.db.department, req.db.expiredTasks, req.db.lateness, req.db.position, req.db.date],
    });
    function getExpiredTasks(employee, month) {
      return employee.expiredTasks?.filter(task => new Date(task.date).getMonth() === month);
    }

    function getLateness(employee, month) {
      return employee.latenesses?.filter(late => new Date(late.lateDay).getMonth() === month);
    }
    res.render('admin/employee', {
      pageTitle: `Xodim ma'lumotlari`,
      employee,
      getExpiredTasks,
      getLateness,
      formatDate,
      getMonth,
    });
  }

  async getLatenessPage(id, req, res) {
    await renderLateness(id, req, res);
  }

  async addLateness(userId, req, res, lateDay, lateTime, explanationLetter) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if(req.file?.path) {
        deleteFile(req.file.path);
      }
      const errorMessage = errors.array()[0].msg;
      const latenessId = '';
      return renderLateness(
        userId,
        req,
        res,
        errorMessage,
        true,
        false,
        lateDay,
        lateTime,
        explanationLetter,
        latenessId,
        formatDate,
      );
    }
    if (!explanationLetter) {
      const errorMessage = 'Tushuntirish xati yuklanmadi';
      const latenessId = '';
      return renderLateness(
        userId,
        req,
        res,
        errorMessage,
        true,
        false,
        lateDay,
        lateTime,
        explanationLetter,
        latenessId,
        formatDate,
      );
    }
    const highestExistingLatenessId = await req.db.lateness.max('id');
    const newLatenessId = highestExistingLatenessId + 1;
    await req.db.lateness.create({ id: newLatenessId, userId, lateDay, lateTime, explanationLetter });
    res.redirect('/');
  }

  async getExpiredTaskPage(id, req, res) {
    await renderExpiredTask(id, req, res);
  }

  async addExpiredTask(userId, req, res, taskNumber, organization, date) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      const expiredTaskId = '';
      return renderExpiredTask(
        userId,
        req,
        res,
        errorMessage,
        true,
        false,
        date,
        taskNumber,
        organization,
        expiredTaskId,
        formatDate,
      );
    }
    const highestExistingExpiredTaskId = await req.db.expiredTasks.max('id');
    const newexpiredTasksId = highestExistingExpiredTaskId + 1;
    await req.db.expiredTasks.create({ id: newexpiredTasksId, userId, taskNumber, organization, date });
    res.redirect('/');
  }

  async updatePosition(id, req, res, name) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return renderAddPosition(req, res, errorMessage);
    }
    const existingPosition = await req.db.position.findOne({ where: { name } });
    if (existingPosition && existingPosition.id.toString() !== id.toString()) {
      return renderAddPosition(req, res, 'Ushbu lavozim oldin kiritilgan', true, name);
    }
    const position = await req.db.position.findByPk(id);
    if (!position) {
      throw new Error('Lavozim topilmadi');
    }
    position.name = name;
    await position.save();
    return res.redirect('/admin/addPosition');
  }

  async updateDepartment(req, res, id, name, numberOfEmployees, vacancy) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return renderAddDepartment(req, res, errorMessage, false, name, numberOfEmployees, vacancy);
    }
    const existingDepartment = await req.db.department.findOne({ where: { name } });
    if (existingDepartment && existingDepartment.id.toString() !== id.toString()) {
      return renderAddDepartment(req, res, `Ushbu bo'lim mavjud`, false, name, numberOfEmployees, vacancy);
    }
    const department = await req.db.department.findByPk(id);
    if (!department) {
      throw new Error(`Bo'lim topilmadi`);
    }
    department.name = name;
    department.numberOfEmployees = numberOfEmployees;
    department.vacancy = vacancy;
    await department.save();
    return res.redirect('/admin/addDepartment');
  }

  async deleteExpiredTask(id, req, res) {
    const expiredTask = await req.db.expiredTasks.findByPk(id);

    if (!expiredTask) {
      throw new Error('Muddat buzilgan xat topilmadi');
    }

    const userId = expiredTask.userId;
    await req.db.expiredTasks.destroy({ where: { id } });
    res.redirect(`/admin/users/${userId}`);
  }

  async deleteLateness(id, req, res) {
    const latenessInfo = await req.db.lateness.findByPk(id);

    if (!latenessInfo) {
      throw new Error("Kechikish ma'lumotlari topilmadi");
    }

    const userId = latenessInfo.userId;
    await req.db.lateness.destroy({ where: { id } });
    deleteFile(latenessInfo.explanationLetter);
    res.redirect(`/admin/users/${userId}`);
  }

  async updateLatenessPage(employeeId, latenessId, req, res) {
    const latenessInfo = await req.db.lateness.findByPk(latenessId);
    if (!latenessInfo) {
      throw new Error("Kechikish ma'lumotlari topilmadi");
    }
    const { lateDay, lateTime, id } = latenessInfo;
    const errorMessage = '';
    renderLateness(
      employeeId,
      req,
      res,
      errorMessage,
      false,
      true,
      lateDay,
      lateTime,
      id,
      formatDate,
    );
  }

  async updateExpiredTaskPage(employeeId, letterId, req, res) {
    const letterInfo = await req.db.expiredTasks.findByPk(letterId);
    const { taskNumber, date, organization, id } = letterInfo;
    const errorMessage = '';
    renderExpiredTask(
      employeeId,
      req,
      res,
      errorMessage,
      false,
      true,
      date,
      taskNumber,
      organization,
      id,
      formatDate,
    );
  }

  async updateEmployeePage(employeeId, req, res) {
    const employee = await req.db.users.findByPk(employeeId);
    const errorMessage = '';
    const { firstname, secondname, lastname, login, password, departmentId, positionId, role, id } =
      employee;
    renderAddEmployee(
      req,
      res,
      errorMessage,
      false,
      true,
      firstname,
      secondname,
      lastname,
      login,
      password,
      positionId,
      departmentId,
      role,
      id,
    );
  }

  async updateLateness(userId, latenessId, req, res, lateDay, lateTime) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if(req.file?.path) {
        deleteFile(req.file.path);
      }
      const errorMessage = errors.array()[0].msg;
      return renderLateness(
        userId,
        req,
        res,
        errorMessage,
        true,
        true,
        lateDay,
        lateTime,
        latenessId,
        formatDate,
      );
    }
    const oldLateness = await req.db.lateness.findByPk(latenessId);
    if (req.file?.path) {
      oldLateness.explanationLetter = req.file.path;
    }
    oldLateness.lateDay = lateDay;
    oldLateness.lateTime = lateTime;
    await oldLateness.save();
    res.redirect(`/admin/users/${userId}`);
  }

  async updateExpiredLetter(userId, expiredTaskId, req, res, taskNumber, organization, date) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return renderExpiredTask(userId, req, res, errorMessage);
    }
    const oldExpiredTask = await req.db.expiredTasks.findByPk(expiredTaskId);
   if (oldExpiredTask) {
    oldExpiredTask.taskNumber = taskNumber;
    oldExpiredTask.organization = organization;
    oldExpiredTask.date = date;
    await oldExpiredTask.save();
  }
    res.redirect(`/admin/users/${userId}`);
  }

  async adminUpdateEmployee(
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
    userId,
  ) {
    const errors = validationResult(req);
    const images = req.files;
    if (!errors.isEmpty()) {
      if(images?.userPhoto || images?.resume) {
        deleteImages(images);
      }
      const errorMessage = errors.array()[0].msg;
      return renderAddEmployee(
        req,
        res,
        errorMessage,
        true,
        true,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
        userId,
      );
    }
    const user = await req.db.users.findOne({ where: { login } });
    if (user && user.login !== login) {
      if(images?.userPhoto || images?.resume) {
        deleteImages(images);
      }
      return renderAddEmployee(
        req,
        res,
        'Ushbu login band',
        true,
        true,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
        userId,
      );
    }
    const candidate = await req.db.users.findOne({ where: { firstname, secondname, lastname } });
    const fullname = `${firstname} ${secondname} ${lastname}`;
    if (candidate && candidate.fullname !== fullname) {
      if(images?.userPhoto || images?.resume) {
        deleteImages(images);
      }
      return renderAddEmployee(
        req,
        res,
        'Ushbu xodim oldin kiritilgan',
        true,
        true,
        firstname,
        secondname,
        lastname,
        login,
        password,
        positionId,
        departmentId,
        role,
        userId,
      );
    }
    const oldEmployee = await req.db.users.findByPk(userId);
    if (images?.userPhoto && images.userPhoto[0].path) {
      if(oldEmployee.photo) {
        deleteFile(oldEmployee.photo);
      }
      oldEmployee.photo = images.userPhoto[0].path;
    }
     if (images?.resume && images.resume[0].path) {
      if(oldEmployee.resume) {
        deleteFile(oldEmployee.resume);
      }
      oldEmployee.resume = images.resume[0].path;
    }
    oldEmployee.firstname = firstname;
    oldEmployee.secondname = secondname;
    oldEmployee.secondname = secondname;
    oldEmployee.lastname = lastname;
    oldEmployee.login = login;
    oldEmployee.positionId = positionId;
    oldEmployee.departmentId = departmentId;
    oldEmployee.role = role;
    await oldEmployee.save();
    return res.redirect('/');
  }

  async getUserExcel(filteredUsers) {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Xodimlar');
    worksheet.columns = [
      { header: '№', key: 'id', width: 10 },
      { header: "Bo'lim", key: 'department', width: 10 },
      { header: 'Xodim', key: 'fullname', width: 10 },
      { header: 'Lavozimi', key: 'position', width: 10 },
      { header: 'Oy', key: 'dates', width: 10 },
      { header: 'Kechikishlar soni', key: 'expiredTasks', width: 10 },
      { header: "Muddati o'tgan xatlar", key: 'latenesses', width: 10 },
    ];

    let counter = 1;
    if (filteredUsers.length > 0) {
      filteredUsers[0].forEach(user => {
        const rowData = {
          id: counter,
          department: user.department.name,
          fullname: user.fullname,
          position: user.position.name,
          dates: user.dates[0].date,
          expiredTasks: user.expiredTasks.length,
          latenesses: user.latenesses.length,
        };

        worksheet.addRow(rowData); // Add data in worksheet
        counter++;
      });
    }

    // Making the first line in excel bold
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
    });

    return workbook;
  }
}

export default new AdminService();
