//importando o Banco de dados e a biblioteca de controle.
const Sequelize = require("sequelize");
const useBcrypt = require('sequelize-bcrypt');
const banco = require("../config/banco");
const Jogador = require("./Jogador");


const Usuario = banco.define("usuarios",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    codigo: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});


useBcrypt(Usuario, {
    field: 'password', // secret field to hash, default: 'password'
    rounds: 12, // used to generate bcrypt salt, default: 12
    compare: 'authenticate', // method used to compare secrets, default: 'authenticate'
});

// Usuario.sync();

module.exports = Usuario;