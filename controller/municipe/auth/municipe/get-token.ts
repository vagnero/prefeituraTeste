import { Request, Response } from "express";

//FUnção que serve para ver se o usuário está logado
export const getToken = async(req: Request, res: Response)=>{
    try {
        const seuCookie = req.cookies['seu-cookie']; // Substitua 'seu-cookie' pelo nome do seu cookie
    if (seuCookie) {
        res.status(200).json({accepted: true, token: seuCookie }); // Envie o cookie como parte da resposta
    } else {
        res.status(404).json({accepted: false, error: "Usuário não logado" });
    }

    } catch (error) {
        res.status(500).json({accepted: false, error: error});
    }
    
    
};