import passport from "passport";

import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { ModelMunicipe } from "../../../../models/municipe/model-municipe";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface municipe{
  idmunicipe: number,
  email: string,
  endereco_idendereco: string
}

const model = new ModelMunicipe();

const GOOGLE_CLIENT_ID = '52438777231-mk9p260s71f5ma6p8apf6fq54112rf9i.apps.googleusercontent.com';
const GOOGLE_CLIENT_SERVICE = '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';
const SESSION_SECRET="TOPSECRETWORD";
const CALLBACK_URL = 'http://localhost:4000/google/auth';
import Municipe from "../../../../interfaces/municipe";
const SECRET_KEY = 'seu-segredo';
passport.use(
    "google",new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SERVICE,
        callbackURL: CALLBACK_URL,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, done) => {
       console.log("Entrou aqui");
       console.log(profile);
        try {
            let query = "SELECT * FROM municipe WHERE email = $1";
            const result = await model.getData(query,[profile.emails && profile.emails[0].value]);
            console.log("ouath google!!!!!");
            console.log(result.data[0]);
            if (result.data.length===0){
                query = "INSERT INTO municipe (email, senha, confirmado) VALUES = ($1, $2, $3)";
                const newUser = await model.getData(query,[profile.emails && profile.emails[0].value, "google", true]);
                console.log(newUser);
                return done(null, newUser.data[0]);
            }else{
                done(null, result.data[0]);
            }
        } catch (error) {
            console.log(error);
        }
        // Aqui você pode verificar se o usuário já está registrado em seu banco de dados
        // Se não estiver, pode registrá-lo
        // profile contém as informações do usuário, como nome, email, etc.
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    
    done(null, user);
  });
  
  passport.deserializeUser((user: Municipe, done) => {
    done(null, user);
  });
  
  export const authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'], // Escopos de acesso ao Google
  });
  
  export const authenticateGoogleCallback = passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login', // Redirecionamento em caso de falha
    session: false, // Desativar a sessão para usar JWT
  });

  export const createToken = (userId: number, userEmail: string, idEndereco: number) => {
    return jwt.sign({ userId, userEmail, idEndereco }, SECRET_KEY, { expiresIn: '1h' });
  };

  export const loginByGoogle = (user: Municipe, res: Response) =>{
    try {
      if(user){
        const token = createToken(user.idmunicipe, user.email, user.endereco_idendereco);
        res.cookie('seu-cookie', token, { httpOnly: true, maxAge: 3600000 });
        res.redirect(`http://localhost:3000/`);
        

        // Não envie uma resposta aqui, pois você já está enviando uma resposta no manipulador de rota
      }
      
    } catch (error) {
      res.status(500).json({message: "Não foi possível realizar o login!"});
    }
  };