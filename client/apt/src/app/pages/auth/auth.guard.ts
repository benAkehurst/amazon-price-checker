import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from './../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private dataService: DataService, private router: Router) {}

  /**
   * This bloack the main app if the user isn't logged in
   */
  public canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.dataService.checkLoggedInStatus()) {
      this.router.navigateByUrl('/auth');
    }
    return this.dataService.checkLoggedInStatus();
  }
}
