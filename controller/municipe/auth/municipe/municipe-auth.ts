import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ModelMunicipe } from '../../../../models/municipe/model-municipe';
import { Request, Response, NextFunction } from 'express';

const model = new ModelMunicipe();
const SECRET_KEY = 'seu-segredo'; // Deve ser mantido em segredo na produção

const createToken = (userId: number, userEmail: string, idEndereco: number) => {
  return jwt.sign({ userId, userEmail, idEndereco }, SECRET_KEY, { expiresIn: '1h' });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.username;
  const senha = req.body.password;
console.log(req.body);
  try {
    const result = await model.getData("SELECT * FROM municipe WHERE email = $1;", [email]);

    if (result.data.length > 0) {
      const foundUser = result.data[0];
    console.log(foundUser);
      if (!foundUser.confirmado) {
        console.log("User not confirmed");
        return res.status(401).json({ message: "User not confirmed" });
        
      }

      bcrypt.compare(senha, foundUser.senha, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        } else {
          if (result) {
            const token = createToken(foundUser.idmunicipe, foundUser.email, foundUser.endereco_idendereco);
            // Configurar o cookie
            res.cookie('seu-cookie', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de expiração

            res.status(200).json({ message: "Login bem-sucedido", token });
          } else {
            res.status(400).json({ message: "Invalid credentials" });
          }
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};
