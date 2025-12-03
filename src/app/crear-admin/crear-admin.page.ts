import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';
import { Usuario } from '../models/usuario';
import { Trabajo } from '../models/trabajo';
@Component({
  selector: 'app-editar',
  templateUrl: './crear-admin.page.html',
  styleUrls: ['./crear-admin.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonInput]
})
export class CrearAdminPage implements OnInit {
  id: number = 0;
  tipoObjeto: string = '';
  UsuarioData: Usuario = {
    identificador: -1,
    nombre: '',
    usuario: '',
    clave: '',
    isAdmin: 0
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

   }
  ngOnInit(): void {
  }

  mostrarSegunTipo() {   
    this.tipoObjeto = sessionStorage['Tipo de objeto'];

    if(this.tipoObjeto === 'usuario') {
      const navData = history.state as { item: Usuario };
      if (navData && navData.item) { this.UsuarioData = navData.item; } 
    }
    else if(this.tipoObjeto === 'trabajo') {
      const navData = history.state as { item: Trabajo };
      if (navData && navData.item) { this.TrabajoData = navData.item; } 
    }
    
  }

  ionViewDidEnter() {
    this.mostrarSegunTipo();
  }

  
  
  crear() {
    if(this.tipoObjeto === 'usuario') {
      this.apiService.createUsuario(this.UsuarioData).subscribe({
        next: () => {
          this.router.navigate(['listado-admin']);
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
        }
      });
    }

    else if(this.tipoObjeto === 'trabajo') {
      this.apiService.createTrabajo(this.TrabajoData).subscribe({
        next: () => {
          this.router.navigate(['listado-admin']);
        },
        error: (err) => {
          console.error('Error al crear fichaje:', err);
        }
      });
    }
  }
  
}
