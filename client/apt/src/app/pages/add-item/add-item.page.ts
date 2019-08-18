import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss']
})
export class AddItemPage implements OnInit {
  public isLoading = false;

  constructor() {}

  ngOnInit() {}

  public onAddItem() {

  }
}
