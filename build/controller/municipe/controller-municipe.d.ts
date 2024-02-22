import Address from "../../interfaces/endereco";
export declare class ControllerMunicipe {
    registerMunicipe(email: string, password: string): Promise<{
        status: number;
        message: any;
    }>;
    registerAdress(adress: Address, idMunicipe: Number): Promise<{
        status: number;
        data: any;
    }>;
    confirmAccount(token: string): Promise<{
        status: number;
        data: any;
    }>;
    updateAdress(adress: Address): Promise<{
        status: number;
        data: any;
    }>;
    getAdressById(id: number): Promise<{
        status: number;
        data: any;
    }>;
}
