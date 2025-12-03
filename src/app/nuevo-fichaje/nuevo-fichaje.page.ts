import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { addCircle, create, trash, time, location } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Fichaje } from '../models/fichaje';
import { Trabajo } from '../models/trabajo';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-nuevo-fichaje',
  templateUrl: './nuevo-fichaje.page.html',
  styleUrls: ['./nuevo-fichaje.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonButton, IonIcon, IonInput, RouterLink, IonSelect, IonSelectOption]
})
export class NuevoFichajePage implements OnInit {

  FichajesData: Fichaje[] = [];
  dia: number = new Date().getDate();
  fechaSalida: Date = new Date();
  fechaEntrada: Date = new Date();
  idTrabajoSeleccionado: number = -1;
  nombreTrabajoSeleccionado: string = "";
  TrabajosData: Trabajo[] = [];

  FichajeData: Fichaje = {
    identificador: -1,
    fechaHoraEntrada: '',
    fechaHoraSalida: '',
    idTrabajo: 1,
    idUsuario: 2,
    geoLat: 0,
    geoLong: 0,
    horasTrabajadas: 0
  };

  UsuarioData: Usuario = {
    identificador: 0,
    nombre: '',
    usuario: '',
    clave: '',
    isAdmin: 0
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public apiService: ApiService,
    private alertController: AlertController
  ) {
    addIcons({ create, trash, addCircle, time, location });
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

  ponerHoraActualEntrada() {
    const hora = new Date();
    this.FichajeData.fechaHoraEntrada = this.reformateoFecha(hora);
  }

  async locate() {
    // Obtengo Geolocalización
    const coordinates = await Geolocation.getCurrentPosition();
    this.FichajeData.geoLat = Number(coordinates.coords.latitude);
    this.FichajeData.geoLong = Number(coordinates.coords.longitude);
  }


  cambiarTrabajoSeleccionado() {
    this.FichajeData.idTrabajo = this.idTrabajoSeleccionado;
  }

  ngOnInit() {
    /* const navData = history.state as { item: FichajeUsuario };
    if (navData && navData.item) { this.FichajeData = navData.item; }  */
  }

  ionViewWillEnter() {
    // Cargar el idUsuario desde sessionStorage ANTES de llamar getAllFichajesUsuario
    const sessionStorage_id = sessionStorage.getItem('idUsuario');
    if (sessionStorage_id !== null) {
      const parsed = parseInt(sessionStorage_id);
      if (!Number.isNaN(parsed)) {
        this.FichajeData.idUsuario = parsed;
      }
    }
    
    this.getAllFichajesUsuario();
    this.getAllTrabajos();  
  }

  ocultarSections() {
    const section = document.getElementById('crearFichaje');
    const section2 = document.getElementById('terminarFichaje');
    const botonNuevoFichaje = document.getElementById('nuevoFichaje');

    // Si no hay fichajes mostrar solo el formulario de crear
    if(this.FichajeData.identificador === -1) {
      if(section && botonNuevoFichaje) {
        section.style.display = 'block';
        botonNuevoFichaje.style.display = 'block';
      }
      if(section2) {
        section2.style.display = 'none';
      }
      return;
    }

    if(!this.FichajeData.fechaHoraSalida || this.FichajeData.fechaHoraSalida == ""){
      this.fechaEntrada = new Date(this.FichajeData.fechaHoraEntrada);
      this.fechaSalida = new Date(this.FichajeData.fechaHoraSalida);

      let fecha_actual = new Date();

      if(fecha_actual.getTime() >= this.fechaEntrada.getTime() && fecha_actual.getTime() - this.fechaEntrada.getTime() < 12 * 60 * 60 * 1000) { // si no hay errores con la hora del dispositivo o la de entrada (posible fecha futura) y hace menos de 12h desde que se inicio el fichaje
        if(section && botonNuevoFichaje) { // se quita el formulario de crear fichaje
          section.style.display = 'none';
          botonNuevoFichaje.style.display = 'none';
        }
        
        if(section2) { // se permite finalizar fichaje
          section2.style.display = 'block';
        }
      }
      else { // se termina el fichaje indicando que se ha retrasado en cerrarlo
        this.terminarFichaje(true);  
        this.crearAlertaFichajeTarde();
      }
    }
    else {
      if(section && botonNuevoFichaje) {
        section.style.display = 'block';
        botonNuevoFichaje.style.display = 'block';
      }
      if(section2) {
        section2.style.display = 'none';
      }
    }
  }

  async crearAlertaFichajeTarde() {
    const alert = await this.alertController.create({
      header: 'Fin de fichaje fuera de tiempo',
      message: 'Dado que no fichaste antes de pasar 12 horas tras la fecha de entrada el fichaje ha sido cerrado automáticamente 12 horas después de esta.',
      buttons: ['Entendido']
    });

    await alert.present();
  }

  getAllFichajesUsuario() {
    this.apiService.getFichajesUsuario(this.FichajeData.idUsuario).subscribe({
      next: (response: Fichaje[]) => {   
        this.FichajesData = response; 
        if(this.FichajesData.length > 0) // si hay algun fichaje
          this.FichajeData = this.FichajesData[this.FichajesData.length-1]; // cojo el ultimo fichaje, ya que es el unico que me interesa, porque cada vez que se crea un fichaje se debe haber cerrado el anterior
        else
          this.FichajeData = {
            identificador: -1,
            fechaHoraEntrada: '',
            fechaHoraSalida: '',
            idTrabajo: 1,
            idUsuario: this.FichajeData.idUsuario, // Mantener el idUsuario actual
            geoLat: 0,
            geoLong: 0,
            horasTrabajadas: 0
          };
        console.log(this.FichajesData);
        console.log(this.FichajeData);
        this.ocultarSections();
      },
      error: (err) => { 
        console.error('Error al obtener fichajes:', err); 
      }
    });
  }

  getAllTrabajos() {
    this.apiService.getAllTrabajos().subscribe({
      next: (response: Trabajo[]) => { 
        this.TrabajosData = response; 
      },
      error: (err) => { 
        console.error('Error al obtener trabajos:', err); 
      }
    });
  }



  terminarFichaje(tarde: boolean) {
    this.fechaEntrada = new Date(this.FichajeData.fechaHoraEntrada);
    
    if(tarde) // si no se ha cerrado el fichado tras 12 horas
      this.fechaSalida = new Date(this.fechaEntrada.getTime() + 12 * 60 * 60 * 1000); // se pone como fecha de salida 12 horas despues de la de entrada y se cierra el fichaje
    else
      this.fechaSalida = new Date();
    
    const identificador = this.FichajeData.identificador;
    const data: any = {
      fechaHoraEntrada: this.FichajeData.fechaHoraEntrada,
      fechaHoraSalida: this.reformateoFecha(this.fechaSalida),
      horasTrabajadas: (this.fechaSalida.getTime() - this.fechaEntrada.getTime()) / (60 * 60 * 1000),
      idTrabajo: this.FichajeData.idTrabajo,
      idUsuario: this.FichajeData.idUsuario,
      geoLat: this.FichajeData.geoLat,
      geoLong: this.FichajeData.geoLong
    }

    this.apiService.updateFichaje(identificador, data, 0).subscribe({
      next: () => {
        if(tarde)
          this.router.navigate(['nuevo-fichaje']);
        else
          this.router.navigate(['inicio']);
      },
      error: (err) => {
        console.error('Error al crear fichaje:', err);
      }
    });

    
  }

  nuevoFichaje() {
    const data: any = {
      fechaHoraEntrada: this.FichajeData.fechaHoraEntrada,
      horasTrabajadas: 0,
      idTrabajo: this.FichajeData.idTrabajo,
      idUsuario: this.FichajeData.idUsuario,
      geoLat: Number(this.FichajeData.geoLat),
      geoLong: Number(this.FichajeData.geoLong)
    };
    // NO envío fechaHoraSalida,  SE PONDRÁ COMO NULL EN LA BASE DE DATOS

    this.apiService.createFichaje(data).subscribe({
      next: () => {
        this.router.navigate(['inicio']);
      },
      error: (err) => {
        console.error('Error al crear fichaje:', err);
      }
    });
  }
}
