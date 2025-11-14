import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio),
    title: 'Vane Alves - Crochê' 
  },
  {
    path: 'pecas',
    loadComponent: () => import('./pages/pecas/pecas').then(m => m.Pecas),
    title: 'Vane Alves - Peças'
  },
  {
    path: 'pecas/:folder/:file/:slug/:id',
    loadComponent: () =>
      import('./pages/pecas/peca-detalhe/peca-detalhe').then(m => m.PecaDetalhe),
    title: 'Peça em Crochê | Vane Alves'
  },
  {
    path: 'customizacao/:folder/:file/:slug/:id',
    loadComponent: () =>
      import('./pages/customizacao/customizacao').then(m => m.Customizacao),
    title: 'Customização | Vane Alves'
  },
  {
    path: 'pecas/:id',
    redirectTo: '/pecas/vestuario/blusas/_/:id'
  },
  {
    path: 'encomendas',
    loadComponent: () =>
      import('./pages/encomendas/encomendas').then(m => m.Encomendas),
    title: 'Vane Alves - Encomendas'
  },
  {
    path: 'aulas',
    loadComponent: () =>
      import('./pages/aulas/aulas').then(m => m.Aulas),
    title: 'Vane Alves - Aulas'
  },
  {
    path: 'contato',
    loadComponent: () =>
      import('./pages/contato/contato').then(m => m.Contato),
    title: 'Vane Alves - Contato'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/nao-encontrada/nao-encontrada').then(m => m.NaoEncontrada),
    title: 'Página não encontrada'
  },
];
