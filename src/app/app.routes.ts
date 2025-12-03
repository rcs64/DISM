import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'fichajes',
    loadComponent: () => import('./fichajes/fichajes.page').then( m => m.FichajesPage)
  },
  {
    path: 'nuevo-fichaje',
    loadComponent: () => import('./nuevo-fichaje/nuevo-fichaje.page').then( m => m.NuevoFichajePage)
  },
  {
    path: 'inicio-admin',
    loadComponent: () => import('./inicio-admin/inicio-admin.page').then( m => m.InicioAdminPage)
  },
  {
    path: 'listado-admin',
    loadComponent: () => import('./listado-admin/listado-admin.page').then( m => m.ListadoAdminPage)
  },
  {
    path: 'editar',
    loadComponent: () => import('./editar/editar.page').then( m => m.EditarPage)
  },
  {
    path: 'crear-admin',
    loadComponent: () => import('./crear-admin/crear-admin.page').then( m => m.CrearAdminPage)
  },
];
