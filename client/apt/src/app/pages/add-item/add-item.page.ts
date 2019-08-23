import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss']
})
export class AddItemPage implements OnInit {
  @ViewChild('f', { static: true }) form: NgForm;
  public isLoading = false;
  public isError = false;
  public isScraping = false;
  public errorText = '';

  constructor(
    private dataService: DataService,
    private aletCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
  }

  public onAddItem() {
    const userId = this.dataService.fetchUserIdFromLS();
    const newUrl = this.form.value['amazon-url'];
    const newTargetPrice = this.form.value['target-price'];
    const newTrackPrice = this.form.value['track-price'];
    const itemData = {
      userId: userId,
      url: newUrl,
      targetPrice: newTargetPrice,
      following: newTrackPrice
    };
    this.isScraping = true;
    this.dataService.addANewItem(itemData).subscribe(response => {
      if (response.success === false) {
        this.isError = response.msg;
      }
      this.isScraping = false;
      this.showAlert(response.msg);
    });
  }

  public validateUrlStr(targetUrl: string) {
    const url = targetUrl;
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(url);
  }

  private showAlert(message: string) {
    this.aletCtrl
      .create({
        header: 'Item Added',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => {
        alertEl.present();
        this.form.reset();
        this.router.navigateByUrl(`/home`);
      });
  }
}
