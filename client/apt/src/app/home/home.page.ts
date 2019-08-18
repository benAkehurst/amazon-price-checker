import { Component, OnInit } from '@angular/core';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public loadedItems: Array<object>[] = [];
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
      this.isLoading = false;
      console.log(this.loadedItems);
    });
  }
}
