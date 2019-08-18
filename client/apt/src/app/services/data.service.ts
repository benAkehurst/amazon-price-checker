import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IItem, INewItem } from "../interfaces/item.interface";

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

  public addItemsToLocalStorage(items: IItem[]) {
    if (localStorage.getItem('items')) {
      localStorage.removeItem('items');
    }
    localStorage.setItem('items', JSON.stringify(items));
  }

  public getItemsFromLocalStorage() {
     if (localStorage.getItem('items')) {
       return JSON.parse(localStorage.getItem('items'));
     }
     return false;
  }

  public clearLocalStorage() {
    localStorage.clear();
  }
}
