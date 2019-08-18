import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IItem, INewItem } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private ApiPrefix = 'http://localhost:3000/';
  private appRoutes = {
    getAll: 'api/get-all-product-data',
    getFollowed: 'api/get-all-followed-items',
    getSingleItem: 'api/fetch-single-item',
    initAddProduct: 'api/initial-add-product',
    updateItem: 'api/update-scraped-item',
    removeItem: 'api/remove-scraped-item'
  };

  public newItem: INewItem;
  public selectedItem: IItem;
  public selectedPage: string;

  constructor(private http: HttpClient) {}

  public getAllItems(): Observable<any> {
    return this.http.get(this.ApiPrefix + this.appRoutes.getAll);
  }

  public getAllFollowedItems(): Observable<any> {
    return this.http.get(this.ApiPrefix + this.appRoutes.getFollowed);
  }

  public getSingleItem(selectedItem: IItem): Observable<any> {
    return this.http.post(
      this.ApiPrefix + this.appRoutes.getSingleItem,
      { id: selectedItem._id },
      { headers: this.headers }
    );
  }

  public addANewItem(newItem: INewItem): Observable<any> {
    return this.http.post(
      this.ApiPrefix + this.appRoutes.initAddProduct,
      {
        url: newItem.url,
        follow: newItem.following,
        targetPrice: newItem.targetPrice
      },
      { headers: this.headers }
    );
  }

  public manuallyUpdatePrice(selectedItem: IItem) {
    return this.http.post(
      this.ApiPrefix + this.appRoutes.updateItem,
      {
        id: selectedItem._id,
        targetPrice: selectedItem.targetPrice
      },
      { headers: this.headers }
    );
  }

  public removeItem(selectedItem: IItem) {
    return this.http.post(
      this.ApiPrefix + this.appRoutes.removeItem,
      {
        id: selectedItem._id
      },
      { headers: this.headers }
    );
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
