import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role?: string; // Adicione outros campos conforme necessário
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error_code: 'NO_TOKEN', error_description: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error_code: 'INVALID_TOKEN_FORMAT', error_description: 'Formato de token inválido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error_code: 'FORBIDDEN', error_description: 'Token inválido' });
    }

    // Adiciona as informações do usuário ao objeto request
    req.user = decoded as JwtPayload;

    next();
  });
};

// Middleware para verificar permissões específicas
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error_code: 'ACCESS_DENIED', error_description: 'Acesso negado' });
  }

  next();
};
