interface Address {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
    numeroend: string;
    complemento: string;
    idEntity: number; //ID de uma entidade, podendo ser do municipe, reclamação, funcionário etc.
}

export default Address;
