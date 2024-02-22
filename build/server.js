"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_municipe_1 = __importDefault(require("./routes/routes-municipe"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: 'http://localhost:3000', // Substitua com a origem do seu aplicativo React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite incluir cookies na solicitação (necessário para autenticação com cookies)
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(routes_municipe_1.default);
app.use(express_1.default.json);
app.listen(4000, function () {
    console.log("Connected on port: " + "4000");
});
