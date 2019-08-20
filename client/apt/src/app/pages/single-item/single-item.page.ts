import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  public isDeleting = false;

  constructor(
    private dataService: DataService,
    private activeRoute: ActivatedRoute,
    private aletCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getItemFromDataService();
  }

  public getItemFromDataService() {
    this.activeRoute.paramMap.subscribe(params => {
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

  public removeItem(singleItem: IItem) {
    this.isDeleting = true;
    this.dataService.removeItem(singleItem).subscribe(response => {
      console.log(response);
      this.isDeleting = false;
      this.showAlert(response.message);
    });
  }

  private showAlert(message: string) {
    this.aletCtrl
      .create({
        header: 'Item Removed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => {
        alertEl.present();
        this.router.navigateByUrl(`/home`);
      });
  }
}
