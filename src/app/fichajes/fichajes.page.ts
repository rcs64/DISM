import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonToggle } from '@ionic/angular/standalone';
import { Fichaje } from '../models/fichaje';
import { ApiService } from '../services/api';
import { NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { locateOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'fichajes.page.html',
  styleUrls: ['fichajes.page.scss'],
  imports: [IonButton, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, IonInput, FormsModule, IonIcon, IonToggle, CommonModule],
})

export class FichajesPage {
  admin: Number = 0;
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
  FichajesData: Fichaje[] = [];
  FichajesDataHoy: Fichaje[] = [];
  dia: number = new Date().getDate();
  map?: Leaflet.Map;
  idUsuario: number = -1;
  marcadores: Map<string, Leaflet.Marker> = new Map(); // Guardar referencia a los marcadores

  leafletMap() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.marcadores.clear(); // Limpiar referencias a marcadores anteriores
    
    let lat;
    let lon;
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    
    let marcador: Leaflet.Marker;
    Marker.prototype.options.icon = iconDefault;
    this.map = Leaflet.map('mapId').setView([38.38735, -0.51238], 4);


    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'DISM © Ionic Leaflet',
    }).addTo(this.map);

    for(let i=0; i<this.FichajesDataHoy.length; i++) {
      lat = this.FichajesDataHoy[i].geoLat;
      lon = this.FichajesDataHoy[i].geoLong;
      const markerId = String(this.FichajesDataHoy[i].identificador);
      
      marcador = Leaflet.marker([lat, lon])
        .addTo(this.map)
        .bindPopup(`Fichaje ${i + 1}`)
        .openPopup();
      
      // Guardar referencia al marcador con su ID
      this.marcadores.set(markerId, marcador);
    }
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

  toggleMarcador(id: string) {
    const marcador = this.marcadores.get(id);
    if (marcador && this.map) {
      if (this.map.hasLayer(marcador)) {
        // Si el marcador está visible, ocultarlo (quitarlo del mapa)
        this.map.removeLayer(marcador);
      } else {
        // Si el marcador está oculto, mostrarlo (añadirlo al mapa)
        marcador.addTo(this.map);
      }
    }
  }


  filtrarPorDia() {
    this.FichajesDataHoy = [];
    let dia_iteracion;
    
    for(let i=0; i<this.FichajesData.length; i++) {
      dia_iteracion = new Date(this.FichajesData[i].fechaHoraEntrada).getDate();
      if(dia_iteracion === this.dia)
        this.FichajesDataHoy.push({...this.FichajesData[i]}); // {...this.FichajesData[i]} clona el objeto original, porque me estaba pasando que estaba sin querer pasándolos por referencia, cargándome los datos originales con el formatearFechaHora y haciendo que no me vaya el for la segunda pasada
    }

    console.log(this.FichajesDataHoy);

    this.leafletMap();

  }

  constructor(
    public apiService: ApiService,
    private nav: NavController,
  ) {
    addIcons({ locateOutline });
  }
  ionViewWillEnter() {
    this.FichajesData = [];
    this.FichajesDataHoy = [];

    // Cargar el idUsuario desde sessionStorage ANTES de llamar getAllFichajesUsuario
    const sessionStorage_id = sessionStorage.getItem('idUsuario');
    if (sessionStorage_id !== null) {
      this.idUsuario = parseInt(sessionStorage_id);
    }
    
    if(sessionStorage['admin']) {
      this.admin = parseInt(sessionStorage['admin']);
      if(this.admin === 1) {
        this.mostrarSiAdmin();
        this.dia = new Date(this.FichajeData.fechaHoraEntrada).getDate();
        this.FichajesData.push(this.FichajeData);
        this.filtrarPorDia();
      }
    }
  }

  mostrarSiAdmin() {   
    if(this.admin === 1) {
      const navData = history.state as { item: Fichaje };
      if (navData && navData.item) { this.FichajeData = navData.item; } 
    }
  }

  getAllFichajesUsuario() {
    this.apiService.getFichajesUsuario(this.idUsuario).subscribe({
      next: (response: Fichaje[]) => { 
        this.FichajesData = response; 
        this.filtrarPorDia();
        this.formatearHora();
        // Generar mapa DESPUÉS de cargar datos
        if(this.FichajesDataHoy.length > 0) {
          this.leafletMap();
        }
      },
      error: (err) => { 
        console.error('Error al obtener fichajes:', err); 
      }
    });
  }
  
  editFichaje(item: Fichaje) {
    this.nav.navigateForward('editar', { state: { item } });
  }

  consultarDetallado(item: Fichaje) {
    this.nav.navigateForward('detallado', { state: { item } });
  }
}
