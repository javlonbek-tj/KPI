import { Router } from 'express';

import authRoutes from './auth.routes.js';
import homeRoutes from './home.routes.js';
import adminRoutes from './admin.routes.js';

const routes = Router();

routes.use(authRoutes);
routes.use('/admin', adminRoutes);
routes.use(homeRoutes);

export default routes;
