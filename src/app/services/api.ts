import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Fichaje } from '../models/fichaje';
import { Trabajo } from '../models/trabajo';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // API Path - ajusta al puerto de tu servidor OpenAPI (8080 según archivo.yaml)
  basePath = 'http://localhost:8080/'

  constructor(private http:HttpClient) { }

  // Opciones Http
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Manejador de errores API
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("Ha ocurrido un error:", error.error.message);
    } else {
      console.error(
        `Código Error: ${error.status}, ` +
        `Body: ${error.error}`
      );
    }
    // Re-emit the original HttpErrorResponse so callers can inspect status/code
    return throwError(() => error);
  }

  // Usuario
  createUsuario(item: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.basePath + 'usuarios/', JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getItem(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.basePath + 'usuarios/' + id).pipe(retry(2), catchError(this.handleError));
  }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.basePath + 'usuarios/').pipe(retry(2), catchError(this.handleError));
  }

  updateUsuario(id: number, item: any): Observable<any> {
    return this.http.put<any>(this.basePath + 'usuarios/' + id, JSON.stringify(item), this.httpOptions).pipe(catchError(this.handleError));
  }

  // usuarios/nombre/{usuario}
  getUsuarioNombre(nombre: string): Observable<any> {
    return this.http.get<any>(this.basePath + 'usuarios/nombre/' + encodeURIComponent(nombre)).pipe(retry(2), catchError(this.handleError));
  }

  deleteUsuario(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(this.basePath + 'usuarios/' + id, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  // Fichaje
  createFichaje(item: Fichaje): Observable<any> {
    return this.http.post<any>(this.basePath + 'fichajes', JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getAllFichajes(): Observable<Fichaje[]> {
    return this.http.get<Fichaje[]>(this.basePath + 'fichajes/').pipe(retry(2), catchError(this.handleError));
  }

  getFichajesUsuario(idUsuario: number): Observable<Fichaje[]> {
    return this.http.get<Fichaje[]>(this.basePath + 'fichajes/usuario/' + idUsuario).pipe(retry(2), catchError(this.handleError));
  }

  // Fichaje/{id}
  
  getFichaje(id: number): Observable<any> {
    return this.http.get<any>(this.basePath + 'fichajes/' + id).pipe(retry(2), catchError(this.handleError));
  }

  updateFichaje(id: number, item: any, admin: number): Observable<any> {
    const body = { ...item, admin }; // necesito anyadir el admin al json
    return this.http.put<any>(this.basePath + 'fichajes/' + id, JSON.stringify(body), this.httpOptions).pipe(catchError(this.handleError));
  }

  deleteFichaje(id: number): Observable<Fichaje> {
    return this.http.delete<Fichaje>(this.basePath + 'fichajes/' + id, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  // Trabajo
  getAllTrabajos(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>(this.basePath + 'trabajos/').pipe(retry(2), catchError(this.handleError));
  }

  getTrabajo(id: number): Observable<any> {
    return this.http.get<any>(this.basePath + 'trabajos/' + id).pipe(retry(2), catchError(this.handleError));
  }

  createTrabajo(item: Trabajo): Observable<Trabajo> {
    return this.http.post<Trabajo>(this.basePath + 'trabajos/', JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }


  // Trabajo/{id}
  updateTrabajo(id: number, item: any): Observable<any> {
    return this.http.put<any>(this.basePath + 'trabajos/' + id, JSON.stringify(item), this.httpOptions).pipe(catchError(this.handleError));
  }

  deleteTrabajo(id: number): Observable<Trabajo> {
    return this.http.delete<Trabajo>(this.basePath + 'trabajos/' + id, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
}
