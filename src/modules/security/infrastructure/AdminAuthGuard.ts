import { UnauthorizedError } from '../domain/exceptions/SecurityErrors.ts';

export class AdminAuthGuard {
  public static verifyAdminToken(headerValue?: string): void {
    const expectedSecret = process.env.ADMIN_SECRET_KEY || process.env.VITE_ADMIN_PASS || 'yesode2026';
    
    if (!headerValue) {
      throw new UnauthorizedError('Header Authorization ausente.');
    }

    const token = headerValue.startsWith('Bearer ') ? headerValue.substring(7).trim() : headerValue.trim();

    if (!token || token !== expectedSecret) {
      throw new UnauthorizedError('Token de autenticação administrativo inválido.');
    }
  }
}

