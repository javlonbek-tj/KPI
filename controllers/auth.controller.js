import tokenService from '../services/token.service.js';
import authService from '../services/auth.service.js';

class AuthController {
  async getLogin(req, res, next) {
    try {
      return await authService.getLogin(res);
    } catch (e) {
      next();
    }
  }

  async postLogin(req, res, next) {
    try {
      const { login, password } = req.body;
      await authService.postLogin(req, res, login, password);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      res.clearCookie('jwt');
      return res.redirect('/login');
    } catch (e) {
      next(e);
    }
  }

  async isAuth(req, res, next) {
    if (req.cookies && req.cookies.jwt) {
      try {
        const token = req.cookies.jwt;
        // 1) verify token
        const decoded = await tokenService.validateRefreshToken(token);
        // 2) Check if user still exists
        const currentUser = await req.db?.users.findByPk(decoded?.id);
        if (!currentUser) {
          return next();
        }

        // THERE IS A LOGGED IN USER
        req.user = currentUser;
        return next();
      } catch (e) {
        next(e);
      }
    }
    next();
  }

  async restrictTo(...roles) {
    return (req, res, next) => {
      if (req.user && !roles.includes(req.user.role)) {
        return res.redirect('/login');
      }
      next();
    };
  }
}

export default new AuthController();
