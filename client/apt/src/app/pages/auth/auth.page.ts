import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  public isLoading = false;
  public isLogin = true;

  constructor(
    private dataService: DataService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private aletCtrl: AlertController
  ) {}

  ngOnInit() {}

  /**
   * This method is used to login/signup the user
   */
  public authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<any>;
        if (this.isLogin) {
          authObs = this.dataService.loginUser(email, password);
        } else {
          authObs = this.dataService.createNewUser(email, password);
        }
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            this.dataService.addUserIDtoLS(resData.obj._id);
            this.dataService.isLoggedIn = true;
            this.dataService.saveLoginStatus();
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists.';
            } else if (code === 'EMAIL_NOT_FOUND' || 'INVALID_PASSWORD') {
              message = 'Error logging in.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  /**
   * Switches the login to register mode
   * LOOK HERE: Switching between 2 UI states
   */
  public onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  /**
   * This is called when a user submits the form
   * LOOK HERE: Template Driven Form Approach
   */
  public onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  /**
   * This method will show an alert if there was an error
   */
  private showAlert(message: string) {
    this.aletCtrl
      .create({
        header: 'Authentication Failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
