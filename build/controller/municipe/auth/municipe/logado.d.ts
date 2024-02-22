import { Response, NextFunction } from 'express';
import AuthenticatedRequest from '../../../../types/express';
declare const verificarAutenticacao: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default verificarAutenticacao;
