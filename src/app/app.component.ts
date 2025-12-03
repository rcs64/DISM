import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon, IonItem, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonList, IonMenuToggle, IonButton, IonInput, IonText } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api';
import { AlertController } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { helpCircle, home } from 'ionicons/icons';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [RouterModule, IonApp, IonRouterOutlet, IonIcon, IonItem, IonSplitPane, IonMenu,
    IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonList, IonMenuToggle, IonButton, IonInput, FormsModule, IonText],
})
export class AppComponent {
  UsuarioData: Usuario = {
    identificador: 0,
    nombre: '',
    usuario: '',
    clave: '',
    isAdmin: 0
  };  
  nombreUsuario: string = "";
  pass: string = "";
  esAdmin: number = 0;
  

  
  constructor(public apiService: ApiService, private alertController: AlertController, private router: Router) {
    addIcons({ helpCircle, home });
  }

  ngOnInit() {
    this.mostrarLogin();
  }

  ionViewWillEnter() {
    this.mostrarLogin();
  }
  ocultarLogin() {
    let login = document.getElementById('login');
    let logout = document.getElementById('logout');

    if(login)
      login.style.display = 'none';

    if(logout)
      logout.style.display = 'block';
  }

  mostrarLogin() {
    let login = document.getElementById('login');
    let logout = document.getElementById('logout');

    if(login)
      login.style.display = 'block';

    if(logout)
      logout.style.display = 'none';
  }

  guardarUserEnSesion() {
    sessionStorage.setItem('idUsuario', `${this.UsuarioData.identificador}`); // guardo el userid en la sesión
  }

  async alerta(cadena: string, header: string) {
    const alert = await this.alertController.create({
      header: header,
      message: cadena,
      buttons: ['Entendido']
    });

    await alert.present();
  }

  logout() {
    sessionStorage['idUsuario'] = -1;
    this.alerta('Cerrando sesión', 'Cerrar sesión');
    this.mostrarLogin();
    this.router.navigate(['/inicio']);
  }

  comprobarAdmin() {
    if(this.UsuarioData.isAdmin  == 1){
      console.log('aaaaaaaaaaaa');
      this.router.navigate(['/inicio-admin']);
    }
  }

  login() {
    this.apiService.getUsuarioNombre(this.nombreUsuario).subscribe({
      next: (response: Usuario) => {
        this.UsuarioData = response;
        console.log(response);
        console.log(this.UsuarioData);
        if(this.UsuarioData.clave === this.pass) {
          let cadena = `Bienvenido, ${this.nombreUsuario}`;
          let header = `Login correcto`
          this.alerta(cadena, header);
          this.ocultarLogin();
          this.guardarUserEnSesion();
          this.comprobarAdmin();

        }
        else {
          let cadena = `Contraseña equivocada para el usuario ${this.nombreUsuario}`;
          let header = 'Error al iniciar sesión';
          this.alerta(cadena, header);
        }
      },
      error: (err) => {
        // If server returns 404 for user-not-found, show friendly message
        if (err && err.status === 404) {
          let cadena = `El usuario ${this.nombreUsuario} no existe`;
          let header = 'Error al iniciar sesión';
          this.alerta(cadena, header);
        } else {
          console.error('Error en login:', err);
          this.alerta('Error al iniciar sesión. Inténtalo más tarde.', 'Fallo en el servidor');
        }
      }
    });
  }
}
