import express from "express";
import { ControllerMunicipe } from "../controller/municipe/controller-municipe";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Municipe from "../interfaces/municipe";
import flash from "connect-flash";
import { login } from "../controller/municipe/auth/municipe/municipe-auth";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import verificarAutenticacao from "../controller/municipe/auth/municipe/logado"
import { authenticateGoogle, authenticateGoogleCallback, loginByGoogle } from "../controller/municipe/auth/municipe/municipe-oauth";
import { getToken } from "../controller/municipe/auth/municipe/get-token";


const controller = new ControllerMunicipe();
const router = express.Router();
router.use(cookieParser());
router.use(flash());
router.post("/cadastrar-municipe", async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const result = await controller.registerMunicipe(email, password);
    res.status(result.status).json({message: result.message});
});

router.get("/", authenticateGoogle);

router.get('/google/auth', authenticateGoogleCallback, (req, res) => {
    // Depois que o usuário estiver autenticado com sucesso, você pode criar um token JWT e enviá-lo de volta para o cliente
    if (req.user) {
        const usuario = req.user as Municipe;
        loginByGoogle(usuario,res);
    }
  });
  router.get('/get-cookie', (req, res) => {
    console.log(req.cookies);
    getToken(req,res);
});

router.get("/confirmar-conta", async (req, res)=>{
    const token = req.query.token as string;

    const result = await controller.confirmAccount(token);
    res.status(result.status).json({message: result.data});
});

router.post("/cadastrar-endereco", verificarAutenticacao, async (req, res)=>{
    const idMunicipe = req.body.idEntity;
    const result = await controller.registerAdress(req.body,idMunicipe)
    res.status(result.status).json(result.data);
    
});


router.put("/atualizar-endereco", verificarAutenticacao, async(req, res)=>{
    const result = await controller.updateAdress(req.body);
    res.status(result.status).json(result.data);
});


router.get("/teste", (req, res)=>{
    console.log("Deu certo!!!");
});

router.post("/login", (req,res,next)=>{
    console.log(req.body);
    login(req,res,next)
});


router.get("/logout", (req, res) => {
    // Remova o cookie do cliente (se estiver usando cookies)
    res.clearCookie('seu-cookie');
  
    // Outras ações de logout se necessário
  
    res.status(200).json({ message: "Logout bem-sucedido" });
  });
  

router.get("/obter-endereco", verificarAutenticacao, async (req,res)=>{
    const id = req.body.id;
    const result = await controller.getAdressById(id);
    res.status(result.status).json(result.data);
});

export default router;
