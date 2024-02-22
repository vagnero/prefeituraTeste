"use strict";
//CLasse criada para interagir com o banco de dados e ter parte das funções básicas do munícipe.
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
exports.ModelMunicipe = void 0;
const db_config_1 = require("../db-config");
const express_1 = __importDefault(require("express"));
const Response = (0, express_1.default)().response;
const app = (0, express_1.default)();
console.log("Promise abaixo: ");
class ModelMunicipe extends db_config_1.DataBase {
    constructor() {
        super();
    }
    //Método para cadastrar um municipe. Retornando true e o objeto, caso seja verdadeiro.
    signUp(queryName, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                try {
                    const result = yield this.db.query(queryName, config);
                    if (result.rows.length > 0) { // Se a query obtiver sucesso, então é retornado o resultado dela
                        return { accepted: true, status: 201, data: result.rows };
                    }
                    else {
                        //O retorno abaixo, é caso a query não retorne nada!!!
                        return { accepted: false, status: 422, data: result.rows };
                    }
                }
                catch (error) {
                    //Se tiver problema com a query ou o banco de dados, retorna a query abaixo. EX: email repetido!
                    if (error instanceof Error) {
                        console.log(error);
                        return { accepted: false, status: 422, data: error };
                    }
                    return { accepted: false, status: 422, data: error };
                }
            }
            //Se o banco de dados tiver desconectado, retorna o objeto abaixo.
            return { accepted: false, status: 500, message: "Banco de dados desconectado" };
        });
    }
    //Método para registrar um token
    registerToken(queryName, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                try {
                    const result = yield this.db.query(queryName, config);
                    if (result.rows.length > 0) {
                        return { accepted: true, status: 201, data: result.rows };
                    }
                    else {
                        return { accepted: false, status: 422, data: result.rows };
                    }
                }
                catch (error) {
                    console.log(error);
                    return { accepted: false, status: 400, data: error };
                }
            }
            return { accepted: false, status: 500, data: "Banco de dados desconectado" };
        });
    }
    //Método que verifica se um token será reenviado ou não.
    updateToken(queryName, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                try {
                    const result = yield this.db.query(queryName, config);
                    if (result.rows.length > 0) {
                        return { accepted: true, status: 201, data: "Token de confirmação enviado ao email!" };
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    }
}
exports.ModelMunicipe = ModelMunicipe;
