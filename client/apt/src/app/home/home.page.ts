import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './../services/data.service';
import { IItem } from '../interfaces/item.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public loadedItems: Array<IItem> = [];
  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.getAllItems();
  }

  ionViewWillEnter() {
    this.getAllItems();
  }

  /**
   * Fetchs all the items in the Database
   */
  public getAllItems() {
    if (this.dataService.getSingleUserItems()) {
      this.loadedItems = this.dataService.getItemsFromLocalStorage();
      this.isLoading = false;
    }
    this.dataService.getSingleUserItems().subscribe(res => {
      if (res.success === false) {
        this.errorMessage = res.message;
      }
      console.log(res);
      this.loadedItems = res.data;
      if (this.loadedItems.length >= 0) {
        this.dataService.addItemsToLocalStorage(this.loadedItems);
        this.isLoading = false;
      }
    });
  }

  public getItemsFromDB() {
    this.dataService.getSingleUserItems().subscribe(res => {
      if (res.success === false) {
        this.errorMessage = res.message;
      }
      this.loadedItems = res.data;
      if (this.loadedItems.length > 0) {
        this.dataService.addItemsToLocalStorage(this.loadedItems);
        this.isLoading = false;
      }
    });
  }

  /**
   * Goes to selected item page
   * @param item
   */
  public goToItemPage(item: IItem) {
    this.dataService.selectedItem = item;
    this.dataService.selectedPage = item._id;
    this.router.navigateByUrl(`/single-item/${item._id}`);
  }

  public addNewItemLink() {
    this.router.navigateByUrl(`/add-item`);
  }
}
