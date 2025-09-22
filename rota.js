import Ex1 from './public/controller/ex1.js';

// função que adiciona as rotas ao express //
export function adicionarRotas(api) {
  api.use(Ex1);
}
