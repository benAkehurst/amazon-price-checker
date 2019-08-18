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
    this.isLoading = true;
    this.getAllItems();
  }

  /**
   * Fetchs all the items in the Database
   */
  public getAllItems() {
    this.dataService.getAllItems().subscribe(res => {
      if (res.success === false) {
        this.errorMessage = res.message;
      }
      this.loadedItems = res.data;
      if (this.loadedItems.length > 0) {
        this.dataService.addItemsToLocalStorage(this.loadedItems);
        this.isLoading = false;
      }
    });
    console.log(this.loadedItems);
  }

  public goToItemPage(item: IItem) {
    this.dataService.selectedItem = item;
    this.dataService.selectedPage = item._id;
    this.router.navigateByUrl(`/single-item/${item._id}`);
  }
}
