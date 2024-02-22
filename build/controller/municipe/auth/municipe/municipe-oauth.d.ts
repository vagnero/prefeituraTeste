import { Response } from 'express';
import Municipe from "../../../../interfaces/municipe";
export declare const authenticateGoogle: any;
export declare const authenticateGoogleCallback: any;
export declare const createToken: (userId: number, userEmail: string, idEndereco: number) => string;
export declare const loginByGoogle: (user: Municipe, res: Response) => void;
