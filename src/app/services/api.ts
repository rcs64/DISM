import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Fichaje } from '../models/fichaje';

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
    return throwError(() => new Error('Ha sucedido un problema, inténtalo más tarde'));
  }

  // Usuario

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.basePath + 'usuarios').pipe(retry(2), catchError(this.handleError));
  }

  createItem(item: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.basePath + 'usuarios/', JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getItem(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.basePath + 'usuarios/' + id).pipe(retry(2), catchError(this.handleError));
  }

  getList(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.basePath + 'usuarios/').pipe(retry(2), catchError(this.handleError));
  }

  updateItem(item: Usuario): Observable<Usuario> {
    console.log("UPDATE: " + JSON.stringify(item));
    return this.http.put<Usuario>(this.basePath + 'usuarios/' + item.identificador, JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  deleteItem(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(this.basePath + 'usuarios/' + id, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  // Fichaje
  createFichaje(item: Fichaje): Observable<any> {
    return this.http.post<any>(this.basePath + 'fichajes', JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getAllFichajes(): Observable<Fichaje[]> {
    return this.http.get<Fichaje[]>(this.basePath + 'fichajes').pipe(retry(2), catchError(this.handleError));
  }

  getFichajesUsuario(idUsuario: number): Observable<Fichaje[]> {
    return this.http.get<Fichaje[]>(this.basePath + 'fichajes/usuario/' + idUsuario).pipe(retry(2), catchError(this.handleError));
  }

  // Fichaje/{id}
  
  getFichaje(id: number): Observable<any> {
    return this.http.get<any>(this.basePath + 'fichajes/' + id).pipe(retry(2), catchError(this.handleError));
  }

  updateFichaje(id: number, item: Fichaje): Observable<any> {
    return this.http.put<any>(this.basePath + 'fichajes/' + id, JSON.stringify(item), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  // Trabajo
  getAllTrabajos(): Observable<any[]> {
    return this.http.get<any[]>(this.basePath + 'trabajos').pipe(retry(2), catchError(this.handleError));
  }

  getTrabajo(id: number): Observable<any> {
    return this.http.get<any>(this.basePath + 'trabajos/' + id).pipe(retry(2), catchError(this.handleError));
  }
}
