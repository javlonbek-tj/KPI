import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth.controller.js';
import isAuth from '../middlewares/isAuth.js';

const authRoutes = Router();

authRoutes.get('/login', authController.getLogin);
authRoutes.post('/login', authController.postLogin);
authRoutes.get('/logout', isAuth, authController.logout);

export default authRoutes;
