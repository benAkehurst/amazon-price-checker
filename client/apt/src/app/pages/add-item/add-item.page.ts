import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../services/data.service';
import { INewItem } from '../../interfaces/item.interface';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss']
})
export class AddItemPage implements OnInit {
  @ViewChild('f', {static: true}) form: NgForm;
  public isLoading = false;
  public newItem: INewItem;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.isLoading = true;
  }

  public onAddItem() {
    const itemData = {
      amazonUrl: this.validateUrlStr(this.form.value['amazon-url']),
      trackPrice: this.form.value['track-price'],
      targetPrice: this.form.value['target-price']
    };
    console.log(itemData);
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
}
