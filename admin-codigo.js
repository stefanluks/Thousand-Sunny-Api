const Usuario = require("./modelos/Usuario");

const codigoAdmin = {
    senha: "SLLHadmin000secrets!@",
    Comparar: (inserida) => {
        if(codigoAdmin.senha == inserida) return true;
        return false;
    },
    GerarCodigoUser: () => {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789@#";
        let saida = "";
        for(let i=0; i< 15; i++){
            saida += abc[Math.floor(Math.random() * abc.length)];
        }
        return saida;
    },
    CheckCodigoUser: (token) => {
        let saida = false;
        let usuarios = Usuario.findAll({attributes: ["id", "usenrame", "codigo"] })
        for(let i=0; i< usuarios.length; i++){
            if(usuarios.codigo == token) saida = true;
        }
        return saida;
    }
}

module.exports = codigoAdmin