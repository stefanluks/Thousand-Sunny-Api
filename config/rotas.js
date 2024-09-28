const Jogador = require("../modelos/Jogador");
const Jogo = require("../modelos/Jogo");
const Usuario = require("../modelos/Usuario");
const useBcrypt = require("sequelize-bcrypt");
const CA = require("../admin-codigo.js");

function Ordenar(lista){
    let saida = [];
    let maiorPonto = 0;
    let maior = null;
    let id = null;

    while(lista.length > 0){
        lista.forEach((jogador, index) => { if(parseInt(jogador.pontos) > maiorPonto){
            maiorPonto = parseInt(jogador.pontos);
            maior = jogador;
            id = index;
        }});
        saida.push(maior);
        lista.splice(id, 1);
        maior = null;
        id = null;
        maiorPonto = 0;
    }

    return saida;
}

const rotas = [
    {
        tipo: "get",
        url: "/jogos",
        info: "Retorna uma lista com todos os jogos cadastrados!",
        func: async (req,res) =>{
            return res.json({
                error: false,
                content: await Jogo.findAll({attributes: ["id", "nome", "descricao"] })
            });
        }
    },{
        tipo: "post",
        url: "/jogos",
        info: `Adicionar um novo jogo. <br> <b>JSON:</b> <br>{<br>&nbsp;&nbsp;<b class='text-primary'>nome:</b><b class='text-success'>"nome do jogo"</b>,<br>&nbsp;&nbsp;<b class="text-primary">descricao:</b><b class="text-success">"descrição do jogo"</b><br>}`,
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
        info: "Buscar o ranking de um determinado jogo pelo seu ID, basta colocar o número do id como parâmetro na url.",
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
                        ranking: Ordenar(rankings),
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
        info: `Adicionar um novo jogador. <br> <b>JSON:</b> <br>{<br>&nbsp;&nbsp;<b class='text-primary'>nome:</b><b class='text-success'>"nome do jogador"</b>,<br>&nbsp;&nbsp;<b class="text-primary">pontos:</b><b class="text-warning"> 0000</b><br><b class="text-primary">jogo:</b><b class="text-warning"> {id do jogo}</b><br>}`,
        func: async (req,res) =>{
            let dados = req.body;
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
        info: "Retorna todas as rotas da API e suas especificações e informações!",
        func: (req, res) => {
            let lista = [];
            rotas.forEach(rota => {
                let urlmake = rota.url.split("/");
                let url = urlmake[1];
                if(urlmake.length == 3) url= urlmake[1]+"/"+urlmake[2];
                lista.push({
                    tipo: rota.tipo,
                    url: url,
                    info: rota.info
                })
            })
            return res.json({
                error: false,
                content: lista
            })
        }
    },{
        tipo: "get",
        url: "/login",
        info: "Para realizar a Autenticação de um usuario use com ?user={username}&senha={senha do usuario}",
        func: async (req,res) =>{
            let dados = req.query;
            const user = await Usuario.findOne({where: {username: dados.user}});
            if(user.authenticate(dados.senha)){
                return res.json({
                    error: false,
                    content: {
                        autenticado: true,
                        msg: "Credenciais Corretas!",
                    }
                })
            }
            return res.json({
                error: true,
                content: {
                    autenticado: false,
                    msg: "Credenciais Incorretas!",
                }
            })
        }
    },{
        tipo: "post",
        url: "/usuario",
        info: "Cadastrar Um novo Usuario",
        func: async (req,res) =>{
            let dados = req.body;
            console.log(dados);
            if(CA.Comparar(dados.adminCodigo)){
                const user = await Usuario.findOne({where: {username: dados.user}});
                if(user){
                    return res.json({
                        error: true,
                        content: {
                            msg: "Úsuario Já Existe!",
                        }
                    })
                }
                const usuario = Usuario.create({
                    username: dados.username,
                    password: dados.senha,
                    codigo: CA.GerarCodigoUser()
                }).then(() => {
                    return res.json({
                        error: false,
                        content: {
                            usuario,
                            msg: "Úsuario cadastrado com sucesso!",
                        }
                    })
                }).catch(err => {
                    return res.json({
                        error: true,
                        content: {msg: "Não foi possivel cadastrar o Usuario"}
                    })
                });
            }
            return res.json({
                error: true,
                content: {msg: "Você não tem autorização para adicionar um novo usuario"}
            })
        }
    }
]

module.exports = rotas;