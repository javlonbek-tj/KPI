import bcrypt from 'bcryptjs';
import tokenService from './token.service.js';

const renderLogin = async (res, errorMessage = '', error = '', login = '', password = '') => {
  return res.render('login', {
    pageTitle: 'Kirish',
    errorMessage,
    error,
    user: {
      login,
      password,
    },
  });
};

class AuthService {
  async getLogin(res) {
    renderLogin(res);
  }

  async postLogin(req, res, login, password) {
       const candidate = await req.db.users.findOne({ where: { login } });
    if (!candidate) {
      const errorMessage = 'Login yoki parol xato';
      return renderLogin(res, errorMessage, true, login, password);
    }
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      const errorMessage = 'Login yoki parol xato';
      return renderLogin(res, errorMessage, true, login, password);
    }
    const payload = {
      id: candidate.id,
      login: candidate.login,
    };
    const token = tokenService.generateToken(payload);
    res.cookie('jwt', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    res.redirect('/');
  }
}

export default new AuthService();
