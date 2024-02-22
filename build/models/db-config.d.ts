import { Pool } from 'pg';
export declare class DataBase {
    private user;
    private host;
    private database;
    private password;
    private port;
    db: Pool | null;
    constructor();
    private dbConnect;
    dbDisconnect(): void;
    excecute(queryName: string, config?: any[]): Promise<boolean>;
    getData(query: string, config?: any): Promise<{
        accepted: boolean;
        data: any;
    }>;
    dataBase(): Pool | null;
}
