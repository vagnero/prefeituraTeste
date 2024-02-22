import { DataBase } from "../db-config";
export declare class ModelMunicipe extends DataBase {
    constructor();
    signUp(queryName: string, config: any[]): Promise<any>;
    registerToken(queryName: string, config: any[]): Promise<{
        accepted: boolean;
        status: number;
        data: any;
    }>;
    updateToken(queryName: string, config: any[]): Promise<{
        accepted: boolean;
        status: number;
        data: string;
    } | undefined>;
}
