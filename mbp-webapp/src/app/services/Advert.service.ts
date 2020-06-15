import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Advert } from '../models/Advert.model';
import {Observable, throwError} from 'rxjs';
import {TypeSeance} from '../models/TypeSeance.model';
import {AdvertItemList} from '../models/AdvertItemList.model';
import {User} from '../models/User.model';
import { AdvertEntity } from '../models/AdvertEntity.model';
import {AdvertEdit} from '../models/AdvertEdit.model';
import {catchError} from 'rxjs/operators';
import { AddParticipant } from '../models/AddParticipant.model';
import { ProprietaireAnnonce } from '../models/ProprietaireAnnonce.model';
import {UserBody} from '../models/UserBody.model';

@Injectable()
export class AdvertService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  createAdvert(advert: Advert): Observable<Advert> {
    return this.http.post<Advert>('http://localhost:8080/createAdvert', advert, this.httpOptions);
  }

  getAdverts(): Observable<AdvertItemList[]> {
    return this.http.get<AdvertItemList[]>('http://localhost:8080/getAllAdvertsItems');
  }

  getAdvertsWhereNotProprietaire(pid: number): Observable<AdvertItemList[]> {
    return this.http.get<AdvertItemList[]>('http://localhost:8080/getAllWhereNotProprietaire/' + pid, this.httpOptions);
  }

  getAdvertsWhereProprietaire(pid: number): Observable<AdvertItemList[]> {
    return this.http.get<AdvertItemList[]>('http://localhost:8080/getAllWhereProprietaire/' + pid, this.httpOptions);
  }

  deleteAdvertById( aid: number): void {
    this.http.delete('http://localhost:8080/deleteAdvert/' + aid).subscribe((s) => {
      });
  }

  getAdvertById( aid: number): Observable<AdvertEntity>  {
    return this.http.get<AdvertEntity>('http://localhost:8080/getAdvertById/' + aid );
  }

  updateAdvert(advert: AdvertEdit): Observable<AdvertEdit> {
    return this.http.put<AdvertEdit>('http://localhost:8080/updateAdvert', advert, this.httpOptions);
  }

  addParticipant(body: AddParticipant): Observable<AddParticipant> {
    return this.http.post<AddParticipant>('http://localhost:8080/addParticipant', body, this.httpOptions);
  }

  getProprietaireByAid(aid: number): Observable<ProprietaireAnnonce> {
      return this.http.get<ProprietaireAnnonce>('http://localhost:8080/getProprioByAid/' + aid, this.httpOptions);
  }

  isProprietaireAnnonce(uid: number, aid: number): boolean {
    let userProp;
    this.getProprietaireByAid(aid).subscribe( proprio => {
      userProp  = proprio.pidProprietaire;
    });
    return userProp === uid;
  }

  getParticipationsByAid(aid: number): Observable<UserBody[]> {
    return this.http.get<UserBody[]>('http://localhost:8080/getParticipationsForAnnonce/'+aid, this.httpOptions);
  }

  supprimerParticipation(pid: number, aid: number): void {
    this.http.delete('http://localhost:8080/deleteParticipation/' + aid + '/' + pid).subscribe((s) => {
    });
  }

}
