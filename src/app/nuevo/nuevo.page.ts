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

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.page.html',
  styleUrls: ['./nuevo.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonInput]
})
export class NuevoPage implements OnInit {
  id: number = 0;
  UsuarioData: Usuario = {
    identificador: 0,
    nombre: '',
    usuario: '',
    clave: '',
    esAdmin: 0
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public apiService: ApiService
  ) {
    addIcons({ create, trash });
   }
  ngOnInit() {
    const navData = history.state as { item: Usuario };
    if (navData && navData.item) { this.UsuarioData = navData.item; } 
  }

  ionViewWillEnter() {
    let sessionStorage_id;
    if(sessionStorage.getItem('idUsuario'))
      sessionStorage_id = sessionStorage.getItem('idUsuario');

    if(sessionStorage_id) // no se por que no me dejaba hacer esto en una linea pero bueno
      this.UsuarioData.identificador = parseInt(sessionStorage_id);
  }

  newUsuario() {
    this.apiService.createItem(this.UsuarioData).subscribe({
      next: () => {
        console.log(this.UsuarioData);
        //this.router.navigate(['home']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
      }
    });
  }
}
