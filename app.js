import express from 'express';
import { adicionarRotas } from './rota.js';
const api = express();
api.use(express.json());

// Adiciona as rotas ao express //
adicionarRotas(api);


// Sobe a API na porta 8000 //
api.listen(8000,() => console.log('API subiu na porta 8000!!'))