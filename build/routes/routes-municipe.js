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
const express_1 = __importDefault(require("express"));
const controller_municipe_1 = require("../controller/municipe/controller-municipe");
const connect_flash_1 = __importDefault(require("connect-flash"));
const municipe_auth_1 = require("../controller/municipe/auth/municipe/municipe-auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logado_1 = __importDefault(require("../controller/municipe/auth/municipe/logado"));
const municipe_oauth_1 = require("../controller/municipe/auth/municipe/municipe-oauth");
const get_token_1 = require("../controller/municipe/auth/municipe/get-token");
const controller = new controller_municipe_1.ControllerMunicipe();
const router = express_1.default.Router();
router.use((0, cookie_parser_1.default)());
router.use((0, connect_flash_1.default)());
router.post("/cadastrar-municipe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const result = yield controller.registerMunicipe(email, password);
    res.status(result.status).json({ message: result.message });
}));
router.get("/", municipe_oauth_1.authenticateGoogle);
router.get('/google/auth', municipe_oauth_1.authenticateGoogleCallback, (req, res) => {
    // Depois que o usuário estiver autenticado com sucesso, você pode criar um token JWT e enviá-lo de volta para o cliente
    if (req.user) {
        const usuario = req.user;
        (0, municipe_oauth_1.loginByGoogle)(usuario, res);
    }
});
router.get('/get-cookie', (req, res) => {
    console.log(req.cookies);
    (0, get_token_1.getToken)(req, res);
});
router.get("/confirmar-conta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const result = yield controller.confirmAccount(token);
    res.status(result.status).json({ message: result.data });
}));
router.post("/cadastrar-endereco", logado_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idMunicipe = req.body.idEntity;
    const result = yield controller.registerAdress(req.body, idMunicipe);
    res.status(result.status).json(result.data);
}));
router.put("/atualizar-endereco", logado_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield controller.updateAdress(req.body);
    res.status(result.status).json(result.data);
}));
router.get("/teste", (req, res) => {
    console.log("Deu certo!!!");
});
router.post("/login", (req, res, next) => {
    console.log(req.body);
    (0, municipe_auth_1.login)(req, res, next);
});
router.get("/logout", (req, res) => {
    // Remova o cookie do cliente (se estiver usando cookies)
    res.clearCookie('seu-cookie');
    // Outras ações de logout se necessário
    res.status(200).json({ message: "Logout bem-sucedido" });
});
router.get("/obter-endereco", logado_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const result = yield controller.getAdressById(id);
    res.status(result.status).json(result.data);
}));
exports.default = router;
