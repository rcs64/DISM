import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.page.html',
  styleUrls: ['./inicio-admin.page.scss'],
  standalone: true,
  imports: [IonContent, RouterLink, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonItem, IonSelect, IonSelectOption]
})
export class InicioAdminPage implements OnInit {
  idUsuario: number = -1;

  constructor() { }

  ngOnInit() {
  }

  guardarUserEnSesion() {
    sessionStorage.setItem('idUsuario', `${this.idUsuario}`); // guardo el userid en la sesión
  }

}
