import { Router } from 'express';
import { check } from 'express-validator';
import adminController from '../controllers/admin.controller.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../utils/fileUpload.js';

const adminRoutes = Router();

adminRoutes.get('/addEmployee', isAuth, adminController.getRegister);
adminRoutes.post(
  '/addEmployee',
  isAuth,
  upload.fields([{name: 'userPhoto'}, {name: 'resume'}]),
  [
    check('departmentId', `Bo'lim nomi kiritilmadi`).not().isEmpty().isString(),
    check('firstname', `Ism kiritilmadi`).not().isEmpty().isString(),
    check('secondname', 'Familiya kiritilmadi').not().isEmpty().isString(),
    check('lastname', 'Sharif kiritilmadi').not().isEmpty().isString(),
    check('positionId', 'Lavozim kiritilmadi').not().isEmpty().isString(),
    check('login', 'Login kiritilmadi').not().isEmpty(),
    check('password', 'Parol kiritilmadi').not().isEmpty(),
  ],
  adminController.postRegister,
);
adminRoutes.get(
  '/addPosition',
  isAuth,
  [check('position', 'Lavozim kiritilmadi').trim().not().isEmpty().isString()],
  adminController.getAddPositionPage,
);
adminRoutes.post(
  '/addPosition',
  isAuth,
  [check('position', 'Lavozim kiritilmadi').trim().not().isEmpty().isString()],
  adminController.postAddPosition,
);
adminRoutes.get('/AddDepartment', isAuth, adminController.getAddDepartmentPage);
adminRoutes.post(
  '/AddDepartment',
  isAuth,
  [
    check('department', `Bo'lim nomi kiritilmadi`).trim().not().isEmpty().isString(),
    check('numberOfEmployees', `Xodimlar soni kiritilmadi`).not().isEmpty().isInt(),
    check('vacancy', 'Vakansiyalar soni kiritilmadi').not().isEmpty().isInt({ min: 0 }),
  ],
  adminController.postAddDepartment,
);
adminRoutes.get('/users/:employeeId', isAuth, adminController.oneEmployee);
adminRoutes.get('/lateness/:employeeId', isAuth, adminController.latenessPage);
adminRoutes.post(
  '/addLateness',
  isAuth,
  upload.single('explanationLetter'),
  [
    check('lateDay', `Sana kiritilmadi`).trim().not().isEmpty(),
    check('lateTime', `Kechikish vaqti kiritilmadi`).not().isEmpty().isString(),
  ],
  adminController.postAddLateness,
);
adminRoutes.get('/letterControl/:employeeId', isAuth, adminController.getExpiredTask);
adminRoutes.post(
  '/letterControl',
  isAuth,
  [
    check('date', `Sana kiritilmadi`).trim().not().isEmpty(),
    check('taskNumber', `Hujjat raqami kiritilmadi`).not().isEmpty().isString(),
    check('organization', 'Tashkilot kiritilmadi').not().isEmpty().isString(),
  ],
  adminController.postAddExpiredTask,
);
adminRoutes.post(
  '/updatePosition',
  isAuth,
  [check('position', 'Lavozim kiritilmadi').trim().not().isEmpty().isString()],
  adminController.updatePositon,
);
adminRoutes.post(
  '/updateDepartment',
  isAuth,
  [
    check('department', `Bo'lim nomi kiritilmadi`).trim().not().isEmpty().isString(),
    check('numberOfEmployees', `Xodimlar soni kiritilmadi`).not().isEmpty().isInt(),
    check('vacancy', 'Vakansiyalar soni kiritilmadi').not().isEmpty().isInt({ min: 0 }),
  ],
  adminController.updateDepartment,
);
adminRoutes.post('/expirationLetter', isAuth, adminController.deleteExpirationLetter);
adminRoutes.post('/lateness', isAuth, adminController.deleteLateness);
adminRoutes.get('/updateLateness/:latenessId', isAuth, adminController.getUpdateLatenessPage);
adminRoutes.post(
  '/updateLateness',
  isAuth,
  upload.single('explanationLetter'),
  [
    check('lateDay', `Sana kiritilmadi`).trim().not().isEmpty(),
    check('lateTime', `Kechikish vaqti kiritilmadi`).not().isEmpty().isString(),
  ],
  adminController.postUpdateLateness,
);
adminRoutes.get('/updateExpiredTask/:letterId', isAuth, adminController.getUpdateExpiredTaskPage);
adminRoutes.post(
  '/updateExpiredTask',
  isAuth,
  [
    check('date', `Sana kiritilmadi`).trim().not().isEmpty(),
    check('taskNumber', `Hujjat raqami kiritilmadi`).not().isEmpty().isString(),
    check('organization', 'Tashkilot kiritilmadi').not().isEmpty().isString(),
  ],
  adminController.postUpdateExpiredTask,
);
adminRoutes.get('/updateEmployee/:employeeId', isAuth, adminController.getUpdateEmployeePage);
adminRoutes.post(
  '/updateEmployee',
  isAuth,
  upload.fields([{name: 'userPhoto'}, {name: 'resume'}]),
  [
    check('departmentId', `Bo'lim nomi kiritilmadi`).not().isEmpty().isString(),
    check('firstname', `Ism kiritilmadi`).not().isEmpty().isString(),
    check('secondname', 'Familiya kiritilmadi').not().isEmpty().isString(),
    check('lastname', 'Sharif kiritilmadi').not().isEmpty().isString(),
    check('positionId', 'Lavozim kiritilmadi').not().isEmpty().isString(),
    check('login', 'Login kiritilmadi').not().isEmpty(),
  ],
  adminController.updateEmployee,
);
adminRoutes.get('/excel', isAuth, adminController.downloadExcel);
adminRoutes.get('/expiredTasksExcel', isAuth, adminController.downloadTasksExcel);

export default adminRoutes;
