import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private ApiPrefix = 'http://localhost:3000/';
  private appRoutes = {
    getAll: 'api/get-all-product-data',
    getFollowed: 'api/get-all-followed-items',
    initAddProduct: 'api/initial-add-product',
    updateItem: 'api/update-scraped-item',
    removeItem: 'api/remove-scraped-item'
  };

  constructor(private http: HttpClient) {}

  public getAllItems(): Observable<any> {
    console.log(this.ApiPrefix + this.appRoutes.getAll);
    return this.http
      .get(this.ApiPrefix + this.appRoutes.getAll);
  }
}
