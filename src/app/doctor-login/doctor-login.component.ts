import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/firebaseauth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  templateUrl: 'doctor-login.component.html',
  selector: 'doctor-login-cmp',
  moduleId: module.id
})
export class DoctorLoginComponent implements OnInit {

  private user: {};
  private isAuth: boolean;
  private showVid: boolean = false;

  constructor(private _authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this._authService.logout();

    this._authService._getUser()
      .subscribe(
      data => {
        if (!data.isAuth) {
          //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
        } else {
          this.isAuth = data.isAuth;
          this.user = data.user;
          this._authService._fetchDocUser(data.user.uid)
            .subscribe(res => {
              console.log("from login: ");
              console.log(res);
              if (res.hasOwnProperty('authUID')) {
                this.activatedRoute.queryParams
                  .subscribe(params => {
                      console.log("query parameters");
                    console.log(params);
                    if (params['next']) {
                      window.location.href = window.location.origin + params['next'];
                    } else {
                      window.location.href = window.location.origin + '/dashboard';
                    }
                 });

              } else {
                this.router.navigate(['doctor-checkup']);

              }

            })
        }
      },
      error => console.log(error)
      );
  }

  doclogin(provider) {
    
      console.log("Regular browser");
     this._authService.doclogin();
      console.log("rerouting from login(provider)")
   
  }
  showVideo() {
    this.showVid = !this.showVid;
  }

}