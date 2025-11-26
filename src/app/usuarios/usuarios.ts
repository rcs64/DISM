import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Usuario } from '../models/usuario';
import { ApiService } from '../services/api';
import { NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { create, listOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'usuarios.page.html',
  styleUrls: ['usuarios.page.scss'],
  imports: [IonIcon, IonButton, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
})
export class UsuariosPage {
  UsuarioData: Usuario[] = [];
  constructor(
    public apiService: ApiService,
    private nav: NavController
  ) {
    addIcons({ create, trash, listOutline });
  }
  ionViewWillEnter() {
    this.getAllUsuarios();
  }
  getAllUsuarios() {
    this.apiService.getList().subscribe({
      next: (response: Usuario[]) => { this.UsuarioData = response; },
      error: (err) => { console.error('Error al obtener usuarios:', err); }
    });
  }
  deleteUsuario(item: Usuario) {
    this.apiService.deleteItem(item.identificador).subscribe({
      next: () => this.getAllUsuarios(),
      error: (err) => { console.error('Error al eliminar usuario:', err); }
    });
  }
  editUsuario(item: Usuario) {
    this.nav.navigateForward('editar', { state: { item } });
  }

  consultarDetallado(item: Usuario) {
    this.nav.navigateForward('detallado', { state: { item } });
  }
}
