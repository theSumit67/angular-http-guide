import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { ConfigService } from '../config/config.service';

export interface Hero {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  heroesUrl = 'http://localhost:3000/heroes';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private config: ConfigService, private http: HttpClient) {}

  /** POST: add a new hero to the database */
  addHero(hero: Hero) {
    return this.http
      .post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(catchError(this.handleError('addHero', hero)));
  }

  // ng.probe($0).componentInstance.heroService.searchHeroes("queryParameters");
  searchHeroes(term: string): Observable<Hero[]> {
    term = term.trim();
    // Add safe, URL encoded search parameter if there is a search term
    const options = term ? { params: new HttpParams().set('name', term) } : {};
    return this.http
      .get<Hero[]>(this.heroesUrl, options)
      .pipe(catchError(this.handleError<Hero[]>('searchHeroes', [])));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
