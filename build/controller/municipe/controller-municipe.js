"use strict";
//Classe criada para configurar os métodos de models e enviar para rotes
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
exports.ControllerMunicipe = void 0;
const model_municipe_1 = require("../../models/municipe/model-municipe");
const email_confirmation_1 = require("./auth/municipe/email-confirmation");
const bcrypt_1 = __importDefault(require("bcrypt")); //serve para criar um hash, para a proteger a senha do usuário
const saltRound = 10; //salt, para aumentar a proteção do hash em 10 vezes (usado abaixo).
const model = new model_municipe_1.ModelMunicipe(); //Instância Model, junto com a configuração do banco de dados.
class ControllerMunicipe {
    //Método que cadastra o municipe juntamente com o seu token
    registerMunicipe(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordHashed = yield bcrypt_1.default.hash(password, saltRound); //Cria a senha hash fortificada com o saltRound.
                //Insere no banco de dados a query abaixo e retorna ela mesma como um objeto.
                let result = yield model.signUp("INSERT INTO municipe(email, senha, confirmado) VALUES($1, $2, $3) RETURNING *", [email, passwordHashed, false]);
                if (result.accepted) { //Se retornar um objeto data, então deu certo.
                    const id = result.data[0].idmunicipe; //Pega o id do municipe
                    console.log(id);
                    const sendingEmail = new email_confirmation_1.EmailConfirmation(email, "Account Confirmation"); //Cria o objeto usando o email criado para enviar o token a ele.
                    const tokenValue = yield sendingEmail.sendEmail(); //Envia o email ao usuário cadastrado
                    if (tokenValue.accepted) { //Se o email for enviado com sucesso!
                        //Query abaixo, junto com o método register token
                        const query = "INSERT INTO tokens(token, datatoken, tempoexpirar, municipe_idmunicipe) VALUES ($1, $2, $3, $4) RETURNING *";
                        const tokenData = yield model.registerToken(query, [tokenValue.token, sendingEmail.creationDate, sendingEmail.expirationDate, id]); //Variáveis da query
                        if (tokenData.accepted) { //Se o token foi gerado com sucesso.
                            return { status: tokenData.status, message: "Cadastro e token criados com sucesso!" };
                        }
                        else { //Caso o token não seja enviado
                            return { status: tokenData.status, message: tokenData.data };
                        }
                    }
                    else { //Caso o email não seja enviado.
                        return { status: tokenValue.status, message: tokenValue.token };
                    }
                }
                else { //Caso dê um erro, aqui será tratado!!!
                    console.log("Entrou no erro aqui");
                    console.log(result.data);
                    if (result.data.code === "23505") {
                        let query = "SELECT * FROM municipe WHERE ($1) = email";
                        const result1 = yield model.getData(query, [email]); //Pega o id e a senha
                        //Compara o password inserido com o password com hash e salt na database
                        const id = parseInt(result1.data[0].idmunicipe);
                        console.log("Entrou auqi tb");
                        const passwordMatch = yield bcrypt_1.default.compare(password, result1.data[0].senha);
                        if (passwordMatch && !result1.data[0].confirmado) { //Se a senha estiver correta e a conta ainda não foi ativa, será reenviado um token.
                            const sendingEmail = new email_confirmation_1.EmailConfirmation(email, "Account Confirmation"); //Cria o objeto usando o email criado para enviar o token a ele.
                            const tokenValue = yield sendingEmail.sendEmail(); //Envia o email ao usuário cadastrado
                            query = `UPDATE tokens SET token = ($1), datatoken = ($2), tempoexpirar = ($3) WHERE municipe_idmunicipe = ${id}`;
                            const result2 = yield model.updateToken(query, [tokenValue.token, sendingEmail.creationDate, sendingEmail.expirationDate]);
                            return { status: 201, message: "Token de confirmação reenviado!" };
                        }
                        else {
                            return { status: 422, message: "Email já cadastrado!" };
                        }
                    }
                }
            }
            catch (error) {
                return { status: 500, message: error };
            }
            return { status: 500, message: "unknown" };
        });
    }
    //Método para registrar um endereço ao municipe
    registerAdress(adress, idMunicipe) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Primeira etapa verifica se o endereço já foi cadastrado.
                let query = `SELECT endereco_idendereco FROM municipe WHERE idmunicipe = ${adress.idEntity}`;
                const verifyAdress = yield model.getData(query);
                if (verifyAdress.data[0].endereco_idendereco !== null) {
                    return { status: 422, data: "Endereço já cadastrado!" };
                }
                //Se não foi então é gerado um novo endereço com as informações do usuário.
                query = "INSERT INTO endereco (cep, rua, bairro, cidade, uf, numeroend, complemento) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
                const result1 = yield model.getData(query, [adress.cep, adress.rua, adress.bairro, adress.cidade, adress.uf,
                    adress.numeroend, adress.complemento]);
                //Depois se o endereço for cadastrado com sucesso, é inserida a chave estrangeira no municipe 
                if (result1.data.length > 0) {
                    query = "UPDATE municipe SET endereco_idendereco = ($1) WHERE idmunicipe = ($2)";
                    const result2 = yield model.excecute(query, [result1.data[0].idendereco, idMunicipe]);
                    if (result2) {
                        return { status: 201, data: "Endereço cadastrado com sucesso" };
                    }
                    else {
                        return { status: 422, data: "Ocorreu algum erro com o municipe" };
                    }
                }
                else {
                    return { status: 422, data: "Ocorreu algum erro na criação do endereço" };
                }
            }
            catch (error) {
                console.log(error);
                return { status: 500, data: error };
            }
        });
    }
    //Método para confirmar a conta utilizando o token de confirmação
    confirmAccount(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = "SELECT * FROM tokens WHERE token = ($1)";
                const result1 = yield model.getData(query, [token]);
                if (result1.data.length > 0) {
                    const actualData = new Date(); //Cria uma data atual, pegando o exato momento q é agora
                    const expirationData = result1.data[0].tempoexpirar; //Pega a data de expiração
                    if (actualData < expirationData) {
                        const id = parseInt(result1.data[0].municipe_idmunicipe);
                        query = `UPDATE municipe SET confirmado = TRUE WHERE idmunicipe = ${id}`;
                        const result2 = yield model.excecute(query);
                        console.log(result2);
                        if (result2) {
                            return { status: 200, data: result1.data[0] };
                        }
                        else {
                            return { status: 500, data: "Banco de dados desconectado" };
                        }
                    }
                    else {
                        throw new Error("Tempo expirado");
                    }
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    if (error.message === "Tempo expirado") {
                        return { status: 422, data: "Tempo expirado" };
                    }
                    else {
                        return { status: 500, data: error };
                    }
                }
            }
            return { status: 500, data: "unknown" };
        });
    }
    updateAdress(adress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "UPDATE endereco SET cep = $1, rua = $2, bairro = $3, cidade = $4, uf = $5, numeroend = $6, complemento = $7 WHERE idendereco = $8";
                const result = yield model.excecute(query, [
                    adress.cep, adress.rua, adress.bairro, adress.cidade, adress.uf, adress.numeroend, adress.complemento, adress.idEntity
                ]);
                if (result) {
                    return { status: 200, data: "Endereço atualizado" };
                }
                else {
                    return { status: 422, data: "Ocorreu algum erro" };
                }
            }
            catch (error) {
                return { status: 500, data: error };
            }
        });
    }
    getAdressById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `SELECT * FROM endereco WHERE idendereco = ${id}`;
                const result = yield model.getData(query);
                if (result.data.length > 0) {
                    return { status: 200, data: result.data[0] };
                }
                else {
                    return { status: 404, data: "Ocorreu algum erro na captura de dados do endereço" };
                }
            }
            catch (error) {
                return { status: 500, data: error };
            }
        });
    }
}
exports.ControllerMunicipe = ControllerMunicipe;
