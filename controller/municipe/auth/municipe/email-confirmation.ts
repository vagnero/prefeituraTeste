//Classe criada para criar um token de confirmação e enviar ao email do usuário.

import nodemailer from "nodemailer"; //Módulo para enviar email.
import {v4 as uuidv4} from "uuid"; //Módulo para gerar um token aleatório.
//Configuração da conta de email que enviará o email.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "protoonbusiness@gmail.com",
        pass: "dknb fumi acrm obxc" //Esse password precisa ser configurado em security na conta do gmail/google.
    }
});

//Classe que contém as configurações do email a ser enviado
export class EmailConfirmation{
    private from: string = "protoonbusiness@gmail.com"                          //Email que envia
    private to: string;                                                         //Email que recebe
    private subject: string;                                                    //Assunto do email
    private text: string = `Clique no link  para confirmar o cadastramento:`;   //Texto informativo
    private token: string = "";                                                 //Token de confirmação
    private confirmationLink: string;                                           //Link de confirmação
    public creationDate: Date;
    public expirationDate: Date;
    constructor(to: string, subject: string){
        this.to = to;
        this.subject = subject;
        this.token = uuidv4(); // Gera um UUID v4
        this.confirmationLink = `http://localhost:4000/confirmar-conta?token=${this.token}`;
        this.creationDate = new Date();
        this.expirationDate = new Date(this.creationDate.getTime() + 5 * 60000);
    }

    //Função que envia o email ao usuário
    public async sendEmail(): Promise<{accepted: boolean; status: number; token: string}> {
        try {
          //Mensagem a ser enviada ao usuário.
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject: this.subject,
                text: this.text + this.confirmationLink,
              };
            
            const result = await transporter.sendMail(mailOptions); 
            if (result.accepted) {
              //Caso o email seja aceitado, será exibido no console a mensagem abaixo e retornado o token junto com um boolean: true.
              console.log("Email enviado com sucesso");
              return {accepted: true, status: 200, token: this.token};
            } else {
              //Caso não seja aceito, será retornado uma mensagem com o boolean falso.
              return {accepted: false, status: 400, token: "Email não aceito pelo usuário!"};
            }
          } catch (error) {
            console.log(error);
            //Caso capture um erro, então há algum erro na configuração do servidor.
            return {accepted: false, status: 500, token: "erro"};
          } 
      }
     
    }
