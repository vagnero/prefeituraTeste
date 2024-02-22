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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = void 0;
const pg_1 = require("pg");
const coString = "postgres://kbptpyky:doWbxUNwS3nlqmvFd516AkfjAjfbWaXu@motty.db.elephantsql.com/kbptpyky";
class DataBase {
    constructor() {
        this.user = "postgres";
        this.host = "localhost";
        this.database = "prefeitura";
        this.password = "1234";
        this.port = 5432;
        this.db = null;
        if (!this.db) {
            this.db = new pg_1.Pool({
                user: this.user,
                host: this.host,
                database: this.database,
                password: this.password,
                port: this.port,
            });
        }
        if (this.db) {
            this.dbConnect();
            console.log("DB Conectada com sucesso!");
        }
        else {
            "Não conseguiu conectar!!";
        }
    }
    dbConnect() {
        if (this.db) {
            this.db.connect();
        }
    }
    dbDisconnect() {
        if (this.db) {
            this.db.end();
        }
    }
    excecute(queryName, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.db) {
                    const queryResult = yield this.db.query(queryName, config);
                    if (queryResult) {
                        return true;
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
            return false;
        });
    }
    getData(query, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.db) {
                    const result = yield this.db.query(query, config);
                    console.log(result.rows);
                    if (result.rows.length > 0) {
                        return { accepted: true, data: result.rows };
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
            return { accepted: false, data: "Banco de dados desconectado" };
        });
    }
    dataBase() {
        return this.db;
    }
}
exports.DataBase = DataBase;
