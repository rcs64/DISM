import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { create, trash } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';
import { Usuario } from '../models/usuario';
import { Trabajo } from '../models/trabajo';
import { Fichaje } from '../models/fichaje';
@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonInput]
})
export class EditarPage implements OnInit {
  id: number = 0;
  tipoObjeto: string = '';
  UsuarioData: Usuario = {
    identificador: -1,
    nombre: '',
    usuario: '',
    clave: '',
    isAdmin: 0
  };
  FichajeData: Fichaje = {
    identificador: -1,
    fechaHoraEntrada: '',
    fechaHoraSalida: '',
    horasTrabajadas: -1,
    idTrabajo: -1,
    idUsuario: -1,
    geoLat: -1,
    geoLong: -1
  };
  TrabajoData: Trabajo = {
    identificador: -1,
    nombre: '',
  };
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public apiService: ApiService
  ) {
    addIcons({ create, trash });
   }
  ngOnInit(): void {
  }

  mostrarSegunTipo() {   
    this.tipoObjeto = sessionStorage['Tipo de objeto'];

    if(this.tipoObjeto === 'usuario') {
      const navData = history.state as { item: Usuario };
      if (navData && navData.item) { this.UsuarioData = navData.item; } 
    }
    else if(this.tipoObjeto === 'fichaje') {
      const navData = history.state as { item: Fichaje };
      if (navData && navData.item) { this.FichajeData = navData.item; } 
    }
    else if(this.tipoObjeto === 'trabajo') {
      const navData = history.state as { item: Trabajo };
      if (navData && navData.item) { this.TrabajoData = navData.item; } 
    }
    
  }

  ionViewDidEnter() {
    this.mostrarSegunTipo();
  }

  private reformateoFecha(d: Date): string {
    // Formatear fecha en hora local (no UTC)
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }

  update() {
    if(this.tipoObjeto === 'usuario') {
      const data: any = {
        nuevoID: this.UsuarioData.identificador,
        nombre: this.UsuarioData.nombre,
        usuario: this.UsuarioData.usuario,
        clave: this.UsuarioData.clave,
        isAdmin: this.UsuarioData.isAdmin
      }
      this.apiService.updateUsuario(sessionStorage['Id elegida'], data).subscribe({
        next: () => { this.router.navigate(['listado-admin']); },
        error: (err) => { console.error('Error al actualizar usuario:', err); }
      });
    }
    else if(this.tipoObjeto === 'trabajo') {
      const data: any = {
        nuevoID: this.TrabajoData.identificador,
        nombre: this.TrabajoData.nombre
      }
      this.apiService.updateTrabajo(parseInt(sessionStorage['Id elegida']), data).subscribe({
      next: () => { this.router.navigate(['listado-admin']); },
      error: (err) => { console.error('Error al actualizar trabajo:', err); }
    });
    }
    else if(this.tipoObjeto === 'fichaje') {
      let fechaSalida = new Date(this.FichajeData.fechaHoraSalida);
      let fechaEntrada = new Date(this.FichajeData.fechaHoraEntrada);
      const data: any = {
        fechaHoraEntrada: this.FichajeData.fechaHoraEntrada,
        fechaHoraSalida: this.reformateoFecha(fechaSalida),
        horasTrabajadas: (fechaSalida.getTime() - fechaEntrada.getTime()) / (60 * 60 * 1000),
        idTrabajo: this.FichajeData.idTrabajo,
        idUsuario: this.FichajeData.idUsuario,
        geoLat: this.FichajeData.geoLat,
        geoLong: this.FichajeData.geoLong
      }
      this.apiService.updateFichaje(parseInt(sessionStorage['Id elegida']), data, 1).subscribe({
      next: () => { this.router.navigate(['listado-admin']); },
      error: (err) => { console.error('Error al actualizar fichaje:', err); }
    });
    }
  }
}
