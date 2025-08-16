// Authentication Service
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// IMPORTANT: Set JWT_SECRET in environment variables for production
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRY = '7d';
const ACCESS_TOKEN_EXPIRY = '15m';

class AuthService {
  constructor() {
    this.tokenBlacklist = new Set();
  }

  async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    
    return { accessToken, refreshToken };
  }

  verifyToken(token) {
    if (this.tokenBlacklist.has(token)) {
      throw new Error('Token revoked');
    }
    return jwt.verify(token, JWT_SECRET);
  }

  async revokeToken(token) {
    // TODO: Implement persistent token revocation storage
    this.tokenBlacklist.add(token);
  }
  
  async isTokenRevoked(token) {
    // TODO: Check persistent storage for revoked tokens
    return this.tokenBlacklist.has(token);
  }
}

module.exports = AuthService;