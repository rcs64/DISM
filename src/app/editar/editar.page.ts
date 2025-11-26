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
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonInput]
})
export class EditarPage implements OnInit {
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
  update() {
    this.apiService.updateItem(this.UsuarioData).subscribe({
      next: () => { this.router.navigate(['home']); },
      error: (err) => { console.error('Error al actualizar usuario:', err); }
    });
  }
}
