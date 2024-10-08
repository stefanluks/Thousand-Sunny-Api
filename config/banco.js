const Sequelize = require('sequelize');
// const UserBanco = require("/etc/secrets/user-db.json");
const UserBanco = require("../user-db.json");

//Criando a instância do Sequelize que recebe as informações do banco para realizar a conexão
const banco = new Sequelize(UserBanco.nome, UserBanco.usuario, UserBanco.senha, {
    host: UserBanco.host,
    dialect: "postgres",
    dialectOptions: {
        ssl: true,
    },  
});
 
//Conectando-se ao banco
banco.authenticate()
.then(()=>{
    //Caso conectado com êxito, a mensagem é exibida.
    console.log("Conexão bem Sucedida!!");
}).catch(()=>{
    //Caso haja algum problema na conexão, a mensagem é exibida.
    console.log("Conexão mal sucedida!!");
});


// Exportando a instância do Sequelize para os outros arquivos.
module.exports = banco;