const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

const rotas = require("./config/rotas");

app.get("/", (req, res) => {
    return res.sendFile(__dirname+"/public/index.html");
})


rotas.forEach(rota=>{
    if(rota.tipo == "get") app.get(rota.url, rota.func);
    if(rota.tipo == "post") app.post(rota.url, rota.func);
})

app.listen(8000, () => {
    console.log("Servidor on-line...");
})