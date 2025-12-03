import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Usuario } from '../models/usuario';
import { Fichaje } from '../models/fichaje';
import { Trabajo } from '../models/trabajo';
import { ApiService } from '../services/api';
import { NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { create, trash } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'listado-admin.page.html',
  styleUrls: ['listado-admin.page.scss'],
  imports: [IonIcon, IonButton, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
})
export class ListadoAdminPage {
  UsuarioData: Usuario[] = [];
  FichajeData: Fichaje[] = [];
  TrabajoData: Trabajo[] = [];
  constructor(
    public apiService: ApiService,
    private nav: NavController
  ) {
    addIcons({ create, trash });
  }
  ionViewWillEnter() {
    this.mostrarSegunTipo();
  }

  mostrarSegunTipo() {
    let sectionUsuarios = document.getElementById('usuario');
    let sectionTrabajos = document.getElementById('trabajo');
    let sectionFichajes = document.getElementById('fichaje');
    
    if(sectionUsuarios)
      sectionUsuarios.style.display = 'none';

    if(sectionFichajes)
      sectionFichajes.style.display = 'none';

    if(sectionTrabajos)
      sectionTrabajos.style.display = 'none';

    if(sessionStorage['Tipo de objeto'] === 'usuario') {
      this.getAllUsuarios();
      if(sectionUsuarios)
        sectionUsuarios.style.display = 'block';
    }
    else if(sessionStorage['Tipo de objeto'] === 'fichaje') {
      this.getAllFichajes();
      if(sectionFichajes)
        sectionFichajes.style.display = 'block';
    }
    else if(sessionStorage['Tipo de objeto'] === 'trabajo') {
      this.getAllTrabajos();
      if(sectionTrabajos)
        sectionTrabajos.style.display = 'block';
    }
  }

  guardarEnSession(id: number) {
    sessionStorage.setItem('Id elegida', `${id}`);
  }

  getAllFichajes() {
    this.apiService.getAllFichajes().subscribe({
      next: (response: Fichaje[]) => { this.FichajeData = response; },
      error: (err) => { console.error('Error al obtener fichajes:', err); }
    });
  }

  getAllTrabajos() {
    this.apiService.getAllTrabajos().subscribe({
      next: (response: Trabajo[]) => { this.TrabajoData = response; },
      error: (err) => { console.error('Error al obtener trabajos:', err); }
    });
  }

  getAllUsuarios() {
    this.apiService.getAllUsuarios().subscribe({
      next: (response: Usuario[]) => { this.UsuarioData = response; },
      error: (err) => { console.error('Error al obtener usuarios:', err); }
    });
  }
  deleteUsuario(item: Usuario) {
    this.apiService.deleteUsuario(item.identificador).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.getAllUsuarios();
      },
      error: (err) => { console.error('Error al eliminar usuario:', err); }
    });
  }
  deleteFichaje(item: Fichaje) {
    this.apiService.deleteFichaje(item.identificador).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.getAllFichajes();
      },
      error: (err) => { console.error('Error al eliminar fichaje:', err); }
    });
  }
  deleteTrabajo(item: Trabajo) {
    this.apiService.deleteTrabajo(item.identificador).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.getAllTrabajos();
      },
      error: (err) => { console.error('Error al eliminar trabajo:', err); }
    });
  }
  edit(item: any) {
    this.guardarEnSession(item.identificador);
    this.nav.navigateForward('editar', { state: { item } });
  }
}
