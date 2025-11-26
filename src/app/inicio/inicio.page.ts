import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonItem, IonSelect, IonSelectOption, IonModal } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { ApiService } from '../services/api';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, RouterLink, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonItem, IonSelect, IonSelectOption, IonModal]
})
export class InicioPage implements OnInit {
idUsuario: number = -1;
UsuariosData: Usuario[] = [];
usuario: Usuario = new Usuario();
esAdmin: number = 0;

  constructor(public apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getAllUsuarios();
    this.comprobarAdmin();
  }

  guardarUserEnSesion() {
    sessionStorage.setItem('idUsuario', `${this.idUsuario}`); // guardo el userid en la sesión
  }

  comprobarAdmin() {
    if(this.esAdmin  == 1){
      console.log('aaaaaaaaaaaa');
      this.router.navigate(['/inicio-admin']);
    }
  }

  getAllUsuarios() {
    this.apiService.getAllUsuarios().subscribe({
      next: (response: Usuario[]) => { 
        this.UsuariosData = response; 
        if (this.UsuariosData && this.UsuariosData.length > 0) {
          this.idUsuario = this.UsuariosData[0].identificador;
          this.esAdmin = this.UsuariosData[0].identificador;
        }
      },
      error: (err) => { 
        console.error('Error al obtener usuarios:', err); 
      }
    });
  }

}
