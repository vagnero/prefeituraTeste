import { Pool, QueryResult, Client } from 'pg'
const coString = "postgres://kbptpyky:doWbxUNwS3nlqmvFd516AkfjAjfbWaXu@motty.db.elephantsql.com/kbptpyky"

export class DataBase{
    private user: string = "postgres";
    private host: string = "localhost";
    private database: string = "prefeitura";
    private password: string = "1234";
    private  port: number =  5432;
    public db: Client | null = null;

    constructor(){
        if(!this.db){
            this.db = new Client(
                coString
            );
        }
        if(this.db){
            this.dbConnect();
            console.log("DB Conectada com sucesso!");
        }else{
            "Não conseguiu conectar!!";
        }
        
    }
    private dbConnect(){
        if(this.db){
            this.db.connect();
        }
        
    }
    public dbDisconnect(){
        if (this.db){
            this.db.end();
        }
    }
    
    public async excecute(queryName: string, config?: any[]): Promise<boolean>{
        
        try {
            if(this.db){
                const queryResult = await this.db.query(queryName, config);
                if(queryResult){
                    return true;
                }
            }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
        return false;
    }

    public async getData(query: string, config?: any): Promise<{accepted: boolean; data: any}>{
        try {
            if(this.db){
                const result = await this.db.query(query,config);
                console.log(result.rows);
                if (result.rows.length>0){
                    return {accepted: true, data: result.rows};
                }
            }
           
        } catch (error) {
            console.log(error);
            throw error;
        }
        return {accepted: false, data: "Banco de dados desconectado"};
    }
   
    public dataBase(): Client | null {
        return this.db;
    }
    
    
}