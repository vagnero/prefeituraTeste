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
exports.loginByGoogle = exports.createToken = exports.authenticateGoogleCallback = exports.authenticateGoogle = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const model_municipe_1 = require("../../../../models/municipe/model-municipe");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model = new model_municipe_1.ModelMunicipe();
const GOOGLE_CLIENT_ID = '52438777231-mk9p260s71f5ma6p8apf6fq54112rf9i.apps.googleusercontent.com';
const GOOGLE_CLIENT_SERVICE = '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';
const SESSION_SECRET = "TOPSECRETWORD";
const CALLBACK_URL = 'http://localhost:4000/google/auth';
const SECRET_KEY = 'seu-segredo';
passport_1.default.use("google", new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SERVICE,
    callbackURL: CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Entrou aqui");
    console.log(profile);
    try {
        let query = "SELECT * FROM municipe WHERE email = $1";
        const result = yield model.getData(query, [profile.emails && profile.emails[0].value]);
        console.log("ouath google!!!!!");
        console.log(result.data[0]);
        if (result.data.length === 0) {
            query = "INSERT INTO municipe (email, senha, confirmado) VALUES = ($1, $2, $3)";
            const newUser = yield model.getData(query, [profile.emails && profile.emails[0].value, "google", true]);
            console.log(newUser);
            return done(null, newUser.data[0]);
        }
        else {
            done(null, result.data[0]);
        }
    }
    catch (error) {
        console.log(error);
    }
    // Aqui você pode verificar se o usuário já está registrado em seu banco de dados
    // Se não estiver, pode registrá-lo
    // profile contém as informações do usuário, como nome, email, etc.
    return done(null, profile);
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.authenticateGoogle = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'], // Escopos de acesso ao Google
});
exports.authenticateGoogleCallback = passport_1.default.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login', // Redirecionamento em caso de falha
    session: false, // Desativar a sessão para usar JWT
});
const createToken = (userId, userEmail, idEndereco) => {
    return jsonwebtoken_1.default.sign({ userId, userEmail, idEndereco }, SECRET_KEY, { expiresIn: '1h' });
};
exports.createToken = createToken;
const loginByGoogle = (user, res) => {
    try {
        if (user) {
            const token = (0, exports.createToken)(user.idmunicipe, user.email, user.endereco_idendereco);
            res.cookie('seu-cookie', token, { httpOnly: true, maxAge: 3600000 });
            res.redirect(`http://localhost:3000/`);
            // Não envie uma resposta aqui, pois você já está enviando uma resposta no manipulador de rota
        }
    }
    catch (error) {
        res.status(500).json({ message: "Não foi possível realizar o login!" });
    }
};
exports.loginByGoogle = loginByGoogle;
