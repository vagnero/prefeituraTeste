interface Municipe {
    idmunicipe: number;
    email: string;
    senha: string;
    confirmado: boolean;
    nomecompleto: string | null;
    rg: string | null;
    cpf: string | null;
    datanasc: Date | null;
    telefonefixo: string | null;
    telefomovel: string | null;
    municipecol: string | null;
    dataregistro: Date;
    endereco_idendereco: number;
  }

  export default Municipe;