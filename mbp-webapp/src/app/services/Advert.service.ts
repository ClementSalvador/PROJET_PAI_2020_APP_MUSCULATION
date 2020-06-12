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

  deleteAdvertById( aid: number): Observable<Advert> {
    return this.http.delete<Advert>('http://localhost:8080/deleteAdvert/' + aid);
  }

  getAdvertById( aid: number): Observable<AdvertEntity>  {
    return this.http.get<AdvertEntity>('http://localhost:8080/getAdvertById/' + aid );
  }

  updateAdvert(advert: AdvertEdit): Observable<AdvertEdit> {
    console.log(advert);
    return this.http.put<AdvertEdit>('http://localhost:8080/updateAdvert', advert, this.httpOptions);
  }

}
