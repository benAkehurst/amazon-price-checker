import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { IItem } from '../interfaces/item.interface';

@Component({
  selector: 'app-items',
  templateUrl: 'items.page.html',
  styleUrls: ['items.page.scss']
})
export class ItemsPage implements OnInit {
  public loadedItems: Array<IItem> = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadedItems = this.dataService.getItemsFromLocalStorage();
    console.log(this.loadedItems);
  }

}
