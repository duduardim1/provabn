import { autenticar,InserirSala,novo,verificarusuario, autorizar, PedirPermisão, CriarChat, ListarChat } from '../repository/ex1.js';
import { generateToken,getAuthentication } from '../utils/jtw.js';
import { Router } from "express";
const endpoints = Router();
const autendicador = getAuthentication();




////Endpoint para criar novo usuario////
endpoints.post('/novousuario', async (req,resp) => {
let f = req.body
let ff = await novo(f);
resp.send({
id:ff, 
mensagem:"Usuario Cadastrado!!"
});
})



////Endpoint para gerar token////
endpoints.post('/gerartoken',async(req,resp) => {
let f = req.body.email;
let fff = req.body.senha;
let ff = await autenticar(f,fff);
if(! ff){
    resp.status(401).send('usuario não encontrado!!')
}
else{let token = generateToken(ff)
resp.send({
token:token
})};
})


///Endpoint para criar nova sala////
endpoints.post('/sala', autendicador, async (req, resp) => {
    const NovaSala = req.body;
    const usuario_id = req.user.id;

    const registro = await InserirSala(NovaSala, usuario_id);
    resp.send({
        "Mensagem": "Sala Criada!",
        "Id Sala": (registro)
    });
})



////Endpoint para Verificar se o usuario tem permissão para entrar na sala////
endpoints.get('/sala/:sala/entrar', autendicador, async (req, resp) => {
let usuarioLogadoId = req.user.id;
let salaId = req.params.sala;

const registro = await verificarusuario(usuarioLogadoId,salaId);


if(!registro){
    resp.send('Você não tem permissão para entrar nessa sala!!')
}

})


////Endpoint para autorizar usuario a entrar na sala////
endpoints.post('/sala/:sala/mudar/:id_usuario', autendicador, async (req, resp) => {
    let usuarioLogadoId = req.user.id;
    let salaId = req.params.sala;
    let usuarioParaAutorizar = req.params.id_usuario;

    const registro = await autorizar(salaId,usuarioParaAutorizar);

    resp.send({
        "Mensagem": registro
    });


});



////Endpoint que vai mudar o status do pedido de permissão para entrar na sala////
endpoints.post('/sala/:sala/autorizar/:id_usuario', autendicador, async (req, resp) => {
    let usuarioLogadoId = req.user.id;

    let salaId = req.params.sala;

    let usuarioParaAutorizar = req.params.id_usuario;

    const registro = await PedirPermisão(salaId,usuarioParaAutorizar);

    resp.send({
        "NOVOPEDIDO": registro
    });
});




///Endpoint para criar chat////
endpoints.post('/chat/:sala/:usuario',autendicador, async (req,resp) => {
let salaId = req.params.sala;
let usuarioId = req.params.usuario;
let mensagem = req.body.mensagem;
let usuarioLogadoId = req.user.id;

let vereficacao = await verificarusuario(salaId,usuarioId);
if(!vereficacao){
    resp.status(401).send('Você não tem permissão para entrar nessa sala!!')
}
 

else{
let registro = await CriarChat(salaId,usuarioId,mensagem);
resp.send({
"Chat": registro
});
}

 })



 ////Endpoint para listar chat////
 endpoints.get('/chat/:sala',autendicador, async (req,resp) => {
    let salaId = req.params.sala;
    let usuarioLogadoId = req.user.id;
    let mostrarchat = await ListarChat(salaId);
    resp.send(mostrarchat);
 })



export default endpoints