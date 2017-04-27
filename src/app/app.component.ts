import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./services/firebaseauth.service";
import { FacebookInitParams, FacebookLoginResponse, FacebookService } from "ng2-facebook-sdk";
import { AppConfig } from "./config/app.config";
import { AngularFire, FirebaseAuth, FirebaseListObservable } from 'angularfire2';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

declare var $: any

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  moduleId: module.id,
  //providers: [AuthService, AngularFire, FacebookService]
})

export class AppComponent implements OnInit, AfterViewInit {

  private currentUser: any;
  private isAuth: boolean;
  private fbAccessToken: string;
  private sideBarCover: any;
  private caredOnes: any;
  private showLoginMod: boolean = false;
  private noCaredOnes: boolean = false;
  private showSideBar: boolean = false;
  // private isLogin: boolean = false;


  ngAfterViewInit(): void {

    $(window).scrollTop();
  }

  constructor(
    private route: ActivatedRoute,
    private _authService: AuthService,
    private fs: FacebookService,
    private router: Router,
    location: PlatformLocation
  ) {
    location.onPopState(() => {
      console.log('pressed back!');

    });




  }//constructor


  showLoginModal() {
    this.showLoginMod = true;
    console.log(this.showLoginMod);
  }
  getCaredones() {
    this._authService._getcaredOnesList(this.currentUser.authUID).subscribe(
      data => {
        console.log("from app.component");
        console.log(data);
        for (let i = 0; i < data.length; i++) {

          this._authService._getMedicationReminders(data[i].uid).subscribe(
            meds => {
              data[i]['hasMedReminder'] = meds.length > 0;
              this._authService._getExerciseData(data[i].uid).subscribe(
                exer => {

                }); // _getExerciseData

            }); // _getMedicationReminders
          this._authService._findOnboardingReview(data[i].uid)
            .subscribe(
            res => {
              data[i]['hasObReview'] = res.hasOwnProperty('$value') ? false : true;
            }
            )

          this._authService._getCaredOneJobs(data[i].uid)
            .subscribe(
            res => {
              data[i]['hasCaredData'] = res.hasOwnProperty('$value') ? false : true;
            }
            )
          // end of my code
        }//  for loop
        this.caredOnes = data;
        console.log("this.caredOnes");
        console.log(data);
        if (data.length == 0) {
          this.noCaredOnes = true;
        }
        else { this.noCaredOnes = false; }
      }//  data
    ); // _getcaredOnesList

  }//  getCaredones
  ngOnInit() {

    $.getScript('../assets/js/material-dashboard.js');
    $.getScript('../assets/js/initMenu.js');
    
    
      console.log(this.router.url);  // to print only path eg:"/login"
      console.log(window.location.hostname);
    this._authService._getUser()
      .subscribe(
      data => {
        if (!data.isAuth) {
          console.log(window.location.pathname);
          console.log(this.route.url);
          console.log(this.route);
        if (window.location.pathname != '/doctor-login' && window.location.pathname != '/logout' ) {
            this.showSideBar = false;
            console.log(window.location.pathname);
            window.location.href = window.location.origin + '/doctor-login?next=' + window.location.pathname;
          }
          else {
            
          }

          //this.router.navigate(['login']);
        }
        else {
          this._authService._fetchUser(data.user.uid)
            .subscribe(res => {
              console.log(res);
              if (res) {

                //console.log("redirecting to dashboard");
                console.log(res);
                if (window.location.pathname != '/doctor-checkup')
                this.showSideBar = true; 
                else this.showSideBar = false; 
                //this.router.navigate(['dashboard']);

              } else {
                console.log("redirecting to checkup");

                this.showSideBar = true;
                this.router.navigate(['/doctor-checkup'])
                // here is the error

              }
            });
        }
      });

  }

  initFB() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.6'
    };
    this.fs.init(fbParams);
    this.fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        if (response.status == 'connected') {
          this.fbAccessToken = response.authResponse.accessToken;
          console.log("this.currentUser.cover;", this.currentUser.cover)
          if (!this.currentUser.hasOwnProperty('cover')) {
            this.setUserCoverPhoto();
          } else {
            this.sideBarCover = this.currentUser.cover;
          }

        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }//initFB()

  logout() {
    return this._authService.logout();
  }

  setUserCoverPhoto(): void {
    if (this.fbAccessToken == null) {
      alert('Disconnected from Facebook. Kindly login again.');
    } else {
      this.fs.api('/' + this.currentUser.authUID + '?fields=cover').then(
        response => {
          console.log("response: \n");
          console.log(response);
          let cover = '/assets/images/cover-sm.png';

          if (response.hasOwnProperty('cover'))
            cover = response.cover.source;
          this.sideBarCover = cover;
          this.currentUser.cover = cover;
          this._authService._saveUserCoverPhoto(this.currentUser.authUID, cover);
        }

      )//fb.api

    }//else
  }//setUserCoverPhoto

  public isLogin() {
    // console.log(window.location.hash);
    if (window.location.hash == '/doctor-login' || window.location.hash == '/doctor-checkup') {
      return false;
    }
    else {
      return true;
    }
  }

}
