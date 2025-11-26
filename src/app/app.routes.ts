import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'consultar',
    loadComponent: () => import('./usuarios/usuarios').then((m) => m.UsuariosPage),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'editar',
    loadComponent: () => import('./editar/editar.page').then( m => m.EditarPage)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./nuevo/nuevo.page').then( m => m.NuevoPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'trabajos',
    loadComponent: () => import('./trabajos/trabajos.page').then( m => m.TrabajosPage)
  },
  {
    path: 'fichajes',
    loadComponent: () => import('./fichajes/fichajes.page').then( m => m.FichajesPage)
  },
  {
    path: 'trabajos',
    loadComponent: () => import('./trabajos/trabajos.page').then( m => m.TrabajosPage)
  },
  {
    path: 'nuevo-fichaje',
    loadComponent: () => import('./nuevo-fichaje/nuevo-fichaje.page').then( m => m.NuevoFichajePage)
  },
  {
    path: 'inicio-admin',
    loadComponent: () => import('./inicio-admin/inicio-admin.page').then( m => m.InicioAdminPage)
  },
];
