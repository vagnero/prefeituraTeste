//CLasse criada para interagir com o banco de dados e ter parte das funções básicas do munícipe.

import { DataBase } from "../db-config";
import express from "express";
const Response = express().response;
const app = express();
console.log("Promise abaixo: ");


export class ModelMunicipe extends DataBase{
    constructor(){
        super();
       
    }
    //Método para cadastrar um municipe. Retornando true e o objeto, caso seja verdadeiro.
    public async signUp(queryName: string, config: any[]): Promise<any>{
        if(this.db){
            try {
                const result = await this.db.query(queryName, config);
                if (result.rows.length>0){// Se a query obtiver sucesso, então é retornado o resultado dela
                    return {accepted: true, status: 201, data: result.rows};
                }else{
                    //O retorno abaixo, é caso a query não retorne nada!!!
                    return {accepted: false, status: 422,  data: result.rows};
                }
            } catch (error) {
                //Se tiver problema com a query ou o banco de dados, retorna a query abaixo. EX: email repetido!
                if(error instanceof Error){
                    console.log(error)
                    return {accepted: false, status: 422,  data: error};
                }
                

                    return {accepted: false, status: 422, data: error};
                
            }
        }
        //Se o banco de dados tiver desconectado, retorna o objeto abaixo.
        return {accepted: false, status: 500, message: "Banco de dados desconectado"};
    }

    //Método para registrar um token
    public async registerToken(queryName: string, config: any[]): Promise<{accepted: boolean; status: number; data: any}>{
        if(this.db){
            try {
                const result = await this.db.query(queryName,config);
                if(result.rows.length>0){
                    return {accepted: true, status: 201, data: result.rows};
                }else{
                    return {accepted: false, status: 422, data: result.rows};
                }
            } catch (error) {
                console.log(error);

                return {accepted: false, status: 400, data: error}; 
            }
        }
        return {accepted: false, status: 500, data: "Banco de dados desconectado"};

    }

    //Método que verifica se um token será reenviado ou não.

    public async updateToken(queryName: string, config: any[]){
        if(this.db){
            try {
                const result = await this.db.query(queryName,config);
                if (result.rows.length>0){
                    return {accepted: true, status: 201, data: "Token de confirmação enviado ao email!"};
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

   

    

    





}


