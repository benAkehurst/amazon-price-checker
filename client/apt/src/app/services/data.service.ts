import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IItem, INewItem } from '../interfaces/item.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private ApiPrefixLocal = 'http://localhost:3000/';
  private appRoutes = {
    createUser: 'api/user/create',
    loginUser: 'api/user/login',
    getAll: 'api/get-all-product-data',
    getFollowed: 'api/get-all-followed-items',
    getSingleItem: 'api/fetch-single-item',
    getSingleUserItems: 'api/get-single-user-items',
    initAddProduct: 'api/initial-add-product',
    updateItem: 'api/update-scraped-item',
    updateFollow: 'api/update-scraped-following',
    removeItem: 'api/remove-scraped-item'
  };

  public newItem: INewItem;
  public selectedItem: IItem;
  public user: IUser;
  public selectedPage = '';
  public isLoggedIn = false;

  constructor(private http: HttpClient) {}

  /**
   * Create User
   */
  public createNewUser(Uemail: string, Upassword: string): Observable<any> {
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.createUser,
      {
        email: Uemail,
        password: Upassword
      },
      { headers: this.headers }
    );
  }

  /**
   * Login User
   */
  public loginUser(Uemail: string, Upassword: string): Observable<any> {
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.loginUser,
      {
        email: Uemail,
        password: Upassword
      },
      { headers: this.headers }
    );
  }

  /**
   * Logout user
   */
  public logoutUser() {
    this.logoutUserLS();
    this.isLoggedIn = false;
  }

  /**
   * GET - all items in the database
   */
  public getAllItems(): Observable<any> {
    return this.http.get(this.ApiPrefixProd + this.appRoutes.getAll);
  }

  /**
   * GET - all items that have follow = true
   */
  public getAllFollowedItems(): Observable<any> {
    return this.http.get(this.ApiPrefixProd + this.appRoutes.getFollowed);
  }

  /**
   * POST - Item ID
   * Gets as single item from the database
   */
  public getSingleItem(_id: string): Observable<any> {
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.getSingleItem,
      { id: _id },
      { headers: this.headers }
    );
  }

  /**
   * POST - Adds an item to the database
   */
  public addANewItem(newItem: any): Observable<any> {
    const userID = JSON.parse(this.fetchUserIdFromLS());
    const data = {
      userId: userID,
      url: newItem.url,
      follow: newItem.following,
      targetPrice: newItem.targetPrice
    };
    console.log(data);
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.initAddProduct,
      data,
      { headers: this.headers }
    );
  }

  /**
   * POST - user ID
   * Gets all the items accociated with a single user
   * This is called when a user is logged in
   */
  public getSingleUserItems(): Observable<any> {
    const userID = JSON.parse(this.fetchUserIdFromLS());
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.getSingleUserItems,
      {
        userId: userID
      },
      { headers: this.headers }
    );
  }

  /**
   * POST
   * This updtes the following status of an item in the database
   */
  public updateFollowStatus(selectedItem: IItem, followBool: boolean) {
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.updateFollow,
      { id: selectedItem._id, follow: followBool },
      { headers: this.headers }
    );
  }

  /**
   * POST
   * Sends a request to the server with an updated price
   */
  public manuallyUpdatePrice(selectedItem: IItem) {
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.updateItem,
      {
        id: selectedItem._id,
        targetPrice: selectedItem.targetPrice
      },
      { headers: this.headers }
    );
  }

  /**
   * POST
   * Removes and item from the database
   */
  public removeItem(selectedItem: IItem) {
    const userID = JSON.parse(this.fetchUserIdFromLS());
    return this.http.post(
      this.ApiPrefixProd + this.appRoutes.removeItem,
      {
        userId: userID,
        itemId: selectedItem._id
      },
      { headers: this.headers }
    );
  }

  /**
   * Adds items to local storage when they come back from the server
   */
  public addItemsToLocalStorage(items: IItem[]) {
    if (localStorage.getItem('items')) {
      localStorage.removeItem('items');
    }
    localStorage.setItem('items', JSON.stringify(items));
  }

  /**
   * Gets items from local storage
   */
  public getItemsFromLocalStorage() {
    if (localStorage.getItem('items')) {
      return JSON.parse(localStorage.getItem('items'));
    }
    return false;
  }

  /**
   * Clears local storage
   */
  public clearLocalStorage() {
    localStorage.clear();
  }

  public addUserIDtoLS(userId: string) {
    if (localStorage.getItem('userId')) {
      localStorage.removeItem('userId');
    }
    localStorage.setItem('userId', JSON.stringify(userId));
  }

  public saveLoginStatus() {
    if (!this.isLoggedIn) {
      return false;
    }
    localStorage.setItem('loggedIn', JSON.stringify(true));
  }

  public checkLoggedInStatus() {
    const status = localStorage.getItem('loggedIn');
    if (!JSON.parse(status)) {
      return false;
    }
    return true;
  }

  public logoutUserLS() {
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('items');
  }

  /**
   * Gets user ID from local storage
   */
  public fetchUserIdFromLS() {
    return localStorage.getItem('userId');
  }

  // public checkUrlString(url: string) {
  //   const addition = 'https://www.';
  //   console.log(url);
  //   if (!url.includes(addition)) {
  //     let 
  //     return true;
  //   }
  //   return false;
  // }
}
