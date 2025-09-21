import express from 'express';
import { adicionarRotas } from './rota.js';
const api = express();
api.use(express.json());


adicionarRotas(api);

api.listen(8000,() => console.log('API subiu na porta 8000!!'))