import { Router } from 'express';
import { homeController } from '../controllers/home.controller.js';
import isAuth from '../middlewares/isAuth.js';

const homeRoutes = Router();

homeRoutes.get('/users', isAuth, homeController.getAllUsers);
homeRoutes.get('/', isAuth, homeController.homePage);
homeRoutes.get('/departments', isAuth, homeController.getDepartments);
homeRoutes.get('/latenesses', isAuth, homeController.getLatenesses);
homeRoutes.get('/expiredTasks', isAuth, homeController.getExpiredTasks);

export default homeRoutes;
