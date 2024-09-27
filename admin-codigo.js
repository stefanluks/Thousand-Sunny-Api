const codigoAdmin = {
    senha: "SLLHadmin000secrets!@",
    Comparar: (inserida) => {
        if(codigoAdmin.senha == inserida) return true;
        return false;
    },
    GerarCodigoUser: () => {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789@#!$%¨&[]<>:;.,?/|";
        let saida = "";
        for(let i=0; i< 15; i++){
            saida += abc[Math.floor(Math.random() * abc.length-1)];
        }
        return saida;
    }
}

module.exports = codigoAdmin