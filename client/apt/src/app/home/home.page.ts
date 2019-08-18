import { Component, OnInit } from '@angular/core';
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
   this.getAllItems();
  }

  /**
   * Fetchs all the items in the Database
   */
  public getAllItems() {
    this.isLoading = true;
    this.dataService.getAllItems().subscribe(res => {
      if (res.success === false) {
        this.errorMessage = res.message;
      }
      this.loadedItems = res.data;
      if (this.loadedItems.length > 0) {
        this.dataService.addItemsToLocalStorage(this.loadedItems);
      }
      this.isLoading = false;
      console.log(this.loadedItems);
    });
  }
}
