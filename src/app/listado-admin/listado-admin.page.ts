import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { Usuario } from '../models/usuario';
import { Fichaje } from '../models/fichaje';
import { Trabajo } from '../models/trabajo';
import { ApiService } from '../services/api';
import { NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { create, trash, mapOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'listado-admin.page.html',
  styleUrls: ['listado-admin.page.scss'],
  imports: [IonIcon, IonButton, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, IonInput, FormsModule, CommonModule],
})
export class ListadoAdminPage {
  UsuarioData: Usuario[] = [];
  FichajeData: Fichaje[] = [];
  TrabajoData: Trabajo[] = [];
  FichajesDataHoy: Fichaje[] = [];
  dia: number = new Date().getDate();
  usuario: string = '';
  diaDeshabilitado: boolean = false;
  constructor(
    public apiService: ApiService,
    private nav: NavController
  ) {
    addIcons({ create, trash, mapOutline });
  }
  ionViewWillEnter() {
    this.mostrarSegunTipo();
  }

  formatearHora() {
    for(let i=0; i<this.FichajesDataHoy.length; i++) {
      this.FichajesDataHoy[i].fechaHoraEntrada = new Date(this.FichajesDataHoy[i].fechaHoraEntrada).toLocaleString();
      if( this.FichajesDataHoy[i].fechaHoraSalida)
        this.FichajesDataHoy[i].fechaHoraSalida = new Date(this.FichajesDataHoy[i].fechaHoraSalida).toLocaleString();
      else
        this.FichajesDataHoy[i].fechaHoraSalida = '-';
    }
  }

  filtrarSegunEleccion() {
    if(this.usuario === '' && this.diaDeshabilitado === false)
      this.filtrarPorDia();
    else if(this.usuario !== '' && this.diaDeshabilitado === true)
      this.filtrarPorNombre();
    else
      this.filtrarPorDiaYNombre();  
  }

  deshabilitarDia() {
    this.diaDeshabilitado = !this.diaDeshabilitado;
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

  filtrarPorDiaYNombre() {
    this.getAllFichajesUsuario(true); // Pasar true para indicar que se aplicará filtro de día
  }

  filtrarPorNombre() {
    this.getAllFichajesUsuario(false);
  }

  filtrarPorDia(nombreTambien: boolean = false) {
    if(!nombreTambien) { // como filtrar por nombre me hace la consulta pal nombre, no tengo que pedir todos los fichajes
      this.apiService.getAllFichajes().subscribe({ // como son llamadas asincronas, no quiero que se adelante
        next: (response: Fichaje[]) => { 
          this.FichajeData = response;
          this.aplicarFiltroDia();
        },
        error: (err) => { console.error('Error al obtener fichajes:', err); }
      });
    } else {
      this.aplicarFiltroDia();
    }
  }

  aplicarFiltroDia() {
    this.FichajesDataHoy = [];
    let dia_iteracion;
    
    for(let i=0; i<this.FichajeData.length; i++) {
      dia_iteracion = new Date(this.FichajeData[i].fechaHoraEntrada).getDate();
      if(dia_iteracion === this.dia)
        this.FichajesDataHoy.push({...this.FichajeData[i]}); // {...this.FichajeData[i]} clona el objeto original, porque me estaba pasando que estaba sin querer pasándolos por referencia, cargándome los datos originales con el formatearFechaHora y haciendo que no me vaya el for la segunda pasada
    }

    // actualizo FichajeData con los resultados filtrados para que se muestren en el HTML
    this.FichajeData = [...this.FichajesDataHoy];
    this.formatearHora();
  }

  guardarEnSession(id: number) {
    sessionStorage.setItem('Id elegida', `${id}`);
    sessionStorage.setItem('admin', `${1}`);
  }

  getAllFichajes() {
    this.apiService.getAllFichajes().subscribe({
      next: (response: Fichaje[]) => { this.FichajeData = response; },
      error: (err) => { console.error('Error al obtener fichajes:', err); }
    });
  }

  getAllFichajesUsuario(aplicarFiltroDia: boolean = false) {
    this.apiService.getFichajeNombreUsuario(this.usuario).subscribe({
      next: (response: Fichaje[]) => { 
        this.FichajeData = response;
        if (aplicarFiltroDia) {
          this.aplicarFiltroDia(); // Aplicar filtro de día después de cargar los datos
        }
      },
      error: (err) => { 
        console.error('Error al obtener fichajes:', err); 
      }
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

  mapa_fichaje(item: any) {
    this.guardarEnSession(item.identificador);
    this.nav.navigateForward('fichajes', { state: { item } });
  }
}
