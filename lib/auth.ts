import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AdminUser, Token } from '../types';
import { VercelRequest } from '@vercel/node';

class AuthService {
  private secretKey: string;
  private algorithm = 'HS256';
  private tokenExpiration = 30; // minutes

  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY || 'adyc-super-secret-key-change-in-production';
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  createAccessToken(userData: { username: string }): Token {
    const expiresIn = `${this.tokenExpiration}m`;
    
    const payload = {
      sub: userData.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (this.tokenExpiration * 60)
    };

    const accessToken = jwt.sign(payload, this.secretKey, { algorithm: this.algorithm });

    return {
      access_token: accessToken,
      token_type: 'bearer'
    };
  }

  verifyToken(token: string): { username: string } | null {
    try {
      const payload = jwt.verify(token, this.secretKey, { algorithms: [this.algorithm] }) as any;
      
      if (!payload.sub) {
        return null;
      }

      return { username: payload.sub };
    } catch (error) {
      return null;
    }
  }

  extractTokenFromRequest(req: VercelRequest): string | null {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7); // Remove "Bearer " prefix
  }

  async authenticateRequest(req: VercelRequest, supabaseService: any): Promise<AdminUser | null> {
    try {
      const token = this.extractTokenFromRequest(req);
      
      if (!token) {
        return null;
      }

      const decoded = this.verifyToken(token);
      
      if (!decoded) {
        return null;
      }

      const adminUser = await supabaseService.getAdminUser(decoded.username);
      
      if (!adminUser || !adminUser.is_active) {
        return null;
      }

      return adminUser;
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;