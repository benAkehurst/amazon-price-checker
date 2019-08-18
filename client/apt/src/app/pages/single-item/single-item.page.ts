import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { IItem } from '../../interfaces/item.interface';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.page.html',
  styleUrls: ['./single-item.page.scss']
})
export class SingleItemPage implements OnInit {
  public itemId = '';
  public singleItem: IItem;
  public lowestPrice: any;
  public isLoading = false;
  public chartLoading = false;
  public priceGraphTitle = 'Past Prices';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getItemFromDataService();
  }

  public getItemFromDataService() {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
    });

    if (this.dataService.selectedPage === '') {
      this.dataService.getSingleItem(this.itemId).subscribe(res => {
        this.singleItem = res.data;
        this.lowestTrackedPrice();
        this.createTrackedPriceChart();
        this.isLoading = false;
      });
    }

    if (this.dataService.selectedItem) {
      this.singleItem = this.dataService.selectedItem;
      this.lowestTrackedPrice();
      this.createTrackedPriceChart();
      this.isLoading = false;
    }
  }

  public lowestTrackedPrice() {
    const arr = this.singleItem.pastPrices;
    Math.min.apply(
      Math,
      arr.map(o => {
        this.lowestTrackedPrice = o;
      })
    );
  }

  public checkFollowingDefault(item: IItem): boolean {
    if (item.following) {
      return true;
    } else {
      return false;
    }
  }

  public createTrackedPriceChart() {
    this.chartLoading = true;
  }
}
