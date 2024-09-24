const Jogador = require("../modelos/Jogador");
const Jogo = require("../modelos/Jogo");

const rotas = [
    {
        tipo: "get",
        url: "/jogos",
        func: async (req,res) =>{
            return res.json({
                error: false,
                content: await Jogo.findAll({attributes: ["id", "nome", "descricao"] })
            });
        }
    },{
        tipo: "post",
        url: "/jogos",
        func: async (req,res) =>{
            let dados = req.body;
            let jogo = await Jogo.findOne({
                attributes:["id","nome","descricao"],
                where:{
                    nome: dados.nome
                }
            });
            if(jogo){
                return res.json({
                    error: true,
                    content: {
                        msg:"Jogo com esse nome já existe!",
                    }
                });
            }
            await Jogo.create(dados).then(()=>{
                // Caso não haja erro o sistema retorna o json informando que não houve erro e a mensagem de cadastrado com sucesso.
                return res.json({
                    error: false,
                    content:{
                        msg: "cadastrado com sucesso!",
                    }
                })
            }).catch(()=>{
                // Caso haja algum erro o sistema returna o json com erro e a mensafem de que não foi cadastrado.
                return res.status(400).json({
                    erro: true,
                    mensage: "Erro: não foi possivel cadastrar Jogo!",
                })
            });
        }
    },{
        tipo: "get",
        url: "/rankingGeral/:id",
        func: async (req,res) =>{
            let id_recebido = req.params.id;
            let jogo = await Jogo.findOne({attributes: ["id", "nome", "descricao"], where: {id: id_recebido}});
            if(jogo){
                let rankings = await Jogador.findAll({
                    attributes: ["id","nome","pontos", "jogo"],
                    where: {jogo: id_recebido},
                    order: [["pontos", "DESC"]]
                });
                return res.json({
                    error: false,
                    content: {
                        id: jogo.id,
                        nome: jogo.nome,
                        descricao: jogo.descricao,
                        ranking: rankings
                    }
                });
            }
            return res.json({
                error: true,
                content: {
                    msg: "Erro: Jogo não encontrado!"
                }
            });
        }
    },{
        tipo: "post",
        url: "/jogador",
        func: async (req,res) =>{
            let dados = req.body;
            console.log(dados);
            let jogador = await Jogador.findOne({
                attributes: ["id", "nome", "pontos", "jogo"],
                where: {nome: dados.nome, jogo: dados.jogo}
            });

            if(jogador){
                if(jogador.pontos < dados.pontos){
                    await Jogador.update(
                        {pontos: dados.pontos},
                        {where: {nome: jogador.nome, jogo: jogador.jogo}}
                    ).then(() => {
                        return res.json({
                            error: false,
                            content: {
                                jogador,
                                msg: "Pontuação Atualizada!"
                            }
                        });
                    }).catch(() => {
                        return res.json({
                            error: true, 
                            content: {
                                msg: "Erro, não foi possivel atualizar a pontuação!"
                            }
                        });
                    })
                }
            }else{
                await Jogador.create({nome: dados.nome, jogo: dados.jogo, pontos: dados.pontos}).then(() => {
                    return res.json({
                        error: false,
                        msg: "Jogador cadastrado!"
                    });
                }).catch((err) => {
                    console.log(err);
                    return res.status(400).json({
                        erro: true,
                        mensage: "Erro: não foi possivel cadastrar Jogo!",
                    })
                })
            }
        }
    },{
        tipo: "get",
        url: "/rotas",
        func: (req, res) => {
            let lista = [];
            rotas.forEach(rota => {
                let url = rota.url.split("/")[1];
                lista.push({
                    tipo: rota.tipo,
                    url: url
                })
            })
            return res.json({
                error: false,
                content: lista
            })
        }
    }
]

module.exports = rotas;