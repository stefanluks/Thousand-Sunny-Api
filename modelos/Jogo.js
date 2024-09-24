//importando o Banco de dados e a biblioteca de controle.
const Sequelize = require("sequelize");
const banco = require("../config/banco");
const Jogador = require("./Jogador");


const Jogo = banco.define("jogos",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});

// Jogo.hasMany(Jogador);

// Jogo.sync();

module.exports = Jogo;