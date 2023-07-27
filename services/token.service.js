import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

class TokenService {
  generateToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '1d',
    });
    return token;
  }
  async validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }
}

export default new TokenService();
