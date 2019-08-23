import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { IItem } from '../../interfaces/item.interface';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {
  public loadedItems: Array<IItem> = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.loadedItems = this.dataService.getItemsFromLocalStorage();
    console.log(this.loadedItems);
  }

  public logoutOfApp() {
    this.dataService.logoutUser();
    this.router.navigateByUrl('/auth');
  }
}
