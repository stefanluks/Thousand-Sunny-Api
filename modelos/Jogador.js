//importando o Banco de dados e a biblioteca de controle.
const Sequelize = require("sequelize");
const banco = require("../config/banco");


const Jogador = banco.define("jogadores",{
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
    jogo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        refereces: "jogos",
        referecesKey: "id",
    },
    pontos:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

// Jogador.sync();

module.exports = Jogador;