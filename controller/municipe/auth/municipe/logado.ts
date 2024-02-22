import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticatedRequest from '../../../../types/express';
// Middleware para verificar se o usuário está autenticado
const verificarAutenticacao = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Obtenha o token do cabeçalho da solicitação
  const token = req.cookies['seu-cookie'];

  // Verifique se o token está presente
  if (!token) { 
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifique se o token é válido
    const decoded = jwt.verify(token, 'seu-segredo') as jwt.JwtPayload;
    req.user = decoded; // Adicione o usuário decodificado ao objeto de solicitação
    next(); // Continue para a próxima camada do middleware
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default verificarAutenticacao;
