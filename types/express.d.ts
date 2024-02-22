import { Request } from 'express';
import jwt from 'jsonwebtoken';
import Municipe from '../interfaces/municipe';

interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload | Municipe;
}

export default AuthenticatedRequest;