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
    this.lowestPrice = Math.min.apply(null, arr.map(item => item.price));
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

  public updateFollowingStatus(e) {
    if (e.target.checked === true) {
      this.isDeleting = true;
      this.dataService
        .updateFollowStatus(this.singleItem, true)
        .subscribe(response => {
          this.showAlert('Following Status Updated');
          this.isDeleting = false;
        });
    }
    if (e.target.checked === false) {
      this.isDeleting = true;
      this.dataService
        .updateFollowStatus(this.singleItem, false)
        .subscribe(response => {
          // this.showAlert(`Following Status: ${response.obj.following}`);
          this.isDeleting = false;
        });
    }
  }

  public removeItem(singleItem: IItem) {
    this.confirmDelete(singleItem);
  }

  private async confirmDelete(singleItem) {
    const alert = await this.aletCtrl.create({
      header: 'Confirm Delete!',
      message: 'Are you <strong>sure</strong> you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Okay',
          handler: () => {
            this.isDeleting = true;
            this.dataService.removeItem(singleItem).subscribe(response => {
              this.isDeleting = false;
              this.router.navigateByUrl(`/home`);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private showAlert(message: string) {
    this.aletCtrl
      .create({
        message: message,
        buttons: ['Close']
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
