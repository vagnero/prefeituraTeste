"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const model_municipe_1 = require("../../../../models/municipe/model-municipe");
const model = new model_municipe_1.ModelMunicipe();
const SECRET_KEY = 'seu-segredo'; // Deve ser mantido em segredo na produção
const createToken = (userId, userEmail, idEndereco) => {
    return jsonwebtoken_1.default.sign({ userId, userEmail, idEndereco }, SECRET_KEY, { expiresIn: '1h' });
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.username;
    const senha = req.body.password;
    console.log(req.body);
    try {
        const result = yield model.getData("SELECT * FROM municipe WHERE email = $1;", [email]);
        if (result.data.length > 0) {
            const foundUser = result.data[0];
            console.log(foundUser);
            if (!foundUser.confirmado) {
                console.log("User not confirmed");
                return res.status(401).json({ message: "User not confirmed" });
            }
            bcrypt_1.default.compare(senha, foundUser.senha, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Internal Server Error" });
                }
                else {
                    if (result) {
                        const token = createToken(foundUser.idmunicipe, foundUser.email, foundUser.endereco_idendereco);
                        // Configurar o cookie
                        res.cookie('seu-cookie', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de expiração
                        res.status(200).json({ message: "Login bem-sucedido", token });
                    }
                    else {
                        res.status(400).json({ message: "Invalid credentials" });
                    }
                }
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
