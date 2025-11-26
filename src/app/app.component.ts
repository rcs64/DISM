import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon, IonItem, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonList, IonMenuToggle, IonButton, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { helpCircle, home } from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [RouterModule, IonApp, IonRouterOutlet, IonIcon, IonItem, IonSplitPane, IonMenu,
    IonHeader, IonToolbar, IonTitle, IonLabel, IonContent, IonList, IonMenuToggle, IonButton, IonInput, FormsModule],
})
export class AppComponent {
  nombreUsuario: string = "";
  pass: string = "";

  
  constructor() {
    addIcons({ helpCircle, home });
  }

  login() {

  }

  registro() {

  }
}
