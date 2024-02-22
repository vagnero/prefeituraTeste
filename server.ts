

import express from "express";
import bodyParser from "body-parser";
import router from "./routes/routes-municipe"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from "passport";

const app = express();
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:3000', // Substitua com a origem do seu aplicativo React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite incluir cookies na solicitação (necessário para autenticação com cookies)
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(router);
app.use(express.json);

app.listen(4000, function(){
    console.log("Connected on port: "+"4000");
})