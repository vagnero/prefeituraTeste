"use strict";
//Classe criada para criar um token de confirmação e enviar ao email do usuário.
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
exports.EmailConfirmation = void 0;
const nodemailer_1 = __importDefault(require("nodemailer")); //Módulo para enviar email.
const uuid_1 = require("uuid"); //Módulo para gerar um token aleatório.
//Configuração da conta de email que enviará o email.
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "protoonbusiness@gmail.com",
        pass: "dknb fumi acrm obxc" //Esse password precisa ser configurado em security na conta do gmail/google.
    }
});
//Classe que contém as configurações do email a ser enviado
class EmailConfirmation {
    constructor(to, subject) {
        this.from = "protoonbusiness@gmail.com"; //Email que envia
        this.text = `Clique no link  para confirmar o cadastramento:`; //Texto informativo
        this.token = ""; //Token de confirmação
        this.to = to;
        this.subject = subject;
        this.token = (0, uuid_1.v4)(); // Gera um UUID v4
        this.confirmationLink = `http://localhost:4000/confirmar-conta?token=${this.token}`;
        this.creationDate = new Date();
        this.expirationDate = new Date(this.creationDate.getTime() + 5 * 60000);
    }
    //Função que envia o email ao usuário
    sendEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Mensagem a ser enviada ao usuário.
                const mailOptions = {
                    from: this.from,
                    to: this.to,
                    subject: this.subject,
                    text: this.text + this.confirmationLink,
                };
                const result = yield transporter.sendMail(mailOptions);
                if (result.accepted) {
                    //Caso o email seja aceitado, será exibido no console a mensagem abaixo e retornado o token junto com um boolean: true.
                    console.log("Email enviado com sucesso");
                    return { accepted: true, status: 200, token: this.token };
                }
                else {
                    //Caso não seja aceito, será retornado uma mensagem com o boolean falso.
                    return { accepted: false, status: 400, token: "Email não aceito pelo usuário!" };
                }
            }
            catch (error) {
                console.log(error);
                //Caso capture um erro, então há algum erro na configuração do servidor.
                return { accepted: false, status: 500, token: "erro" };
            }
        });
    }
}
exports.EmailConfirmation = EmailConfirmation;
