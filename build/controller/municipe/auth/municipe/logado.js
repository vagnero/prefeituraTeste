"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware para verificar se o usuário está autenticado
const verificarAutenticacao = (req, res, next) => {
    // Obtenha o token do cabeçalho da solicitação
    const token = req.cookies['seu-cookie'];
    // Verifique se o token está presente
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    try {
        // Verifique se o token é válido
        const decoded = jsonwebtoken_1.default.verify(token, 'seu-segredo');
        req.user = decoded; // Adicione o usuário decodificado ao objeto de solicitação
        next(); // Continue para a próxima camada do middleware
    }
    catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};
exports.default = verificarAutenticacao;
