import { conection } from "../conection/conecxao.js";



////função para criar novo usuario////
export async function novo(novousuario) {
const comando = `INSERT INTO usuario (nome, email, senha) VALUES (?, ?, MD5(?));`
const [info] = await conection.query(comando,[novousuario.nome,
novousuario.email,
novousuario.senha
])
return info.insertId
}









///função para autenticar usuario////
export async function autenticar(email,senha) {
const comando = `SELECT id, email, senha FROM usuario
WHERE email = ? and senha = MD5(?)`
const [info] = await conection.query(comando,[email,senha])
return info[0]
}










///função para criar nova sala////
/// Nessa função o usuario que cria a sala já tem permissão para entrar nela pois ele é o dono/a da sala///
export async function InserirSala(NovaSala, usuario_id) {
    const comando = `
    INSERT INTO sala (nome, usuario_id)
    VALUES (?,?)
    `

    const [info] = await conection.query(comando, [
        NovaSala.nome,
        usuario_id
    
    ]);

    const sala_id = info.insertId;

    const comando1 = `
    INSERT INTO salaPermissao (sala_id, usuario_id,aprovado)
    VALUES
    (?,?,?)
    `

    const [info1] = await conection.query(comando1, [
        sala_id,
        usuario_id,
        true
    ])

    return [sala_id];
}











///função para verificar se o usuario tem permissão para entrar na sala////
export async function verificarusuario(sala_id, usuario_id) {

   const comando = `
    SELECT id
    FROM salaPermissao
    WHERE sala_id = ?
    AND usuario_id = ?
    and aprovado = true
    `
const [info] = await conection.query(comando,
[
sala_id,
usuario_id
])  

if(info.length === 1){
    return ("VOCÊ É O DONO DA SALA PODE ENTRAR!!")
}

else{
    return ("mensagem:VOCÊ NÃO TEM PERMISSÃO PARA ENTRAR NESSA SALA!!")

}

 
}




///função para pedir permissão para entrar na sala////
export async function PedirPermisão(usuario_id,sala_id){
const comando = `INSERT INTO salaPermissao (sala_id, usuario_id, aprovado) VALUES (?, ?, FALSE);
`
const [info] = await conection.query(comando,[usuario_id,sala_id])

return info.insertId

}











///função para autorizar usuario a entrar na sala////
export async function autorizar(sala_id,usuario_id){
const comando =
`UPDATE salaPermissao
SET aprovado = TRUE
WHERE sala_id = ?
AND usuario_id = ?`

const [info] = await conection.query(comando,[sala_id,usuario_id])

return info;

}














////função para criar chat////
export async function CriarChat(usuario_id,sala_id,mensagem,criacao){
const comando = `INSERT INTO chat (usuario_id, sala_id, mensagem, criacao) VALUES (?, ?, ?, NOW())`

const [info] = await conection.query(comando,[usuario_id,sala_id,mensagem,new Date()])

return info.insertId

}











///função para listar chat////
export async function ListarChat(sala_id){
    const comando = `SELECT chat.id,
         chat.usuario_id,
         nome,
         mensagem,
         criacao
    FROM chat
    JOIN usuario ON chat.usuario_id = usuario.id
   WHERE sala_id = ?
   ORDER 
      BY criacao ASC`

const [info] = await conection.query(comando,[sala_id])

return info

}