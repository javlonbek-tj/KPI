import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { globalErrorHandler, get404 } from './controllers/error.controller.js';
import pg from './services/pg.js';
import AuthController from './controllers/auth.controller.js';
import routes from './routes/index.routes.js';
import job from './utils/cronJob.js';
dotenv.config();

// Import routes

const app = express();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const db = await pg();

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });

    app.set('view engine', 'ejs');
    app.set('views', 'views');

    app.use('/images', express.static(path.resolve('images')));
    app.use(express.static(path.resolve('public')));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    app.use(compression());

    app.use((req, res, next) => {
      req.db = db;
      job.start();
      next();
    });

    app.use(AuthController.isAuth);

    // Set global user
    app.use(function (req, res, next) {
      res.locals.user = req.user || null;
      next();
    });

    app.use(routes);
    app.use(get404);
    app.use(globalErrorHandler);
  } catch (err) {
    console.log(err);
  }
}

start();
