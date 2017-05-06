import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../services/firebaseauth.service";
import { Router } from "@angular/router";
import { AppConfig } from '../config/app.config';
//import { DoctorCheckup } from "../models/doctorcheckup.interface";
import { FbService } from "../services/facebook.service";


import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { environment } from '../environment';
import { DomSanitizer } from '@angular/platform-browser';
;

declare var $: any;
@Component({
  templateUrl: 'doctorcheckup.component.html',
  selector: 'doctorcheckup-cmp',
  moduleId: module.id

})
export class DoctorCheckupComponent implements OnInit, AfterViewInit {


  public signupForm: FormGroup;
  private formReady: boolean = false;
  private showErrorFlag: boolean = false;
  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private fbAccessToken: string;
  appID: any;
  pageID: any;
  passThrough: any;
  private currentUserID: any;
  private fbMessURL: any;
  private pageNameList: any = [];
  private pageIDList: any = [];
  private pageAccesTList: any = [];
  private specialityList: any = [];
  private years: any = [];
  @ViewChild('fbCheck') fbCheckbox: ElementRef;

  private reminderKey: string = 'TestJbK_';

  constructor(
    private fb: FormBuilder,
    private _fs: FbService,
    private fs: FacebookService,
    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {

    this.initFB();
    this.updateYears();
  }
  updateYears() {
    let i = 0;
    //console.log("day pushed")
    for (let i = 0; i < 100; i++) {
      this.years[i] = i;
      ////console.log("days pushed", i)
    }
  }
  ngOnInit() {



    this.specialityList = ['Gynaecology', 'Medical Specialist', 'Orthopedics', 'Dental', 'Dermatology', 'Cardiology',]

    // $('html,body').animate({ scrollTop: $("#header").offset().top - 200 }, 500);
    this._authService._getUser()
      .subscribe(
      data => {
        this.isAuth = data.isAuth;
        this.currentUser = data.user;
        this.appID = AppConfig.messenger[environment.envName].appID;
        this.pageID = AppConfig.messenger[environment.envName].pageID;
        $('#myIframe').attr('src', this.fbMessURL);
        this.passThrough = "FacbkId_" + data.user.uid;

        //console.log("User Data received")
        //console.log(data.user);

        this._authService._fetchUser(data.user.uid)
          .subscribe(res => {
            //console.log("from fetchuser");
            //console.log(res);
            if (res) {
              this.currentUser = this._authService._getCurrentUser();
            }
          });

        this.signupForm = this.fb.group({

          // We can set default values by passing in the corresponding value or leave blank if we wish to not set the value. For our example, we’ll default the gender to male.
          'firstName': [data.user.firstName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
          'lastName': [data.user.lastName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
          'email': [data.user.email, Validators.required],
          'avatar': data.user.avatar,
          'experience': ['', Validators.required],
          'page': null,
          'phone': ['', Validators.required],
          'clinicLocation': [null, Validators.required],
          'authProvider': data.user.provider,
          'authUID': data.user.uid,
          'address': [''],
          'mci_number': ['', Validators.required],
          'speciality': ['', Validators.required],
          'fbPageId': [''],
          'clinic': ['', Validators.required],
          'qualification': ['', Validators.required],
          'fullName': ['Dr. ' + data.user.firstName + ' ' + data.user.lastName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        });
        //console.log("this.signupForm");
        //console.log(this.signupForm);
        this.formReady = true;
        //this._fs.initFbMessenger()

        this.currentUserID = data.user.uid;
      },
      //end => { this.initFbCheckboxPlugin(this.currentUserID); }
    );
  }

  ngAfterViewInit() {
    // this.initFbCheckboxPlugin(this.currentUserID);
  }//ngAfterViewInit

  /*initFbCheckboxPlugin(uid) {

    let tmpl = `<div class="fb-send-to-messenger"
                    messenger_app_id="`+ AppConfig.messenger[environment.envName].appID + `"
                    page_id="`+ AppConfig.messenger[environment.envName].pageID + `"
                    data-ref="FacbkId_`+ uid +
      `" color="white"
                    size="xlarge"
                    >`;
    this.fbCheckbox.nativeElement.innerHTML = tmpl;

  }//initFbCheckboxPlugin*/
  submitForm(form: any): void {

  }//submitForm

  showError() {
    //console.log("clicked");
    this.showErrorFlag = true;
  }

  getSRCurl() {
    this.fbMessURL = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appID + "&page_id=" + this.pageID + "&ref=" + this.passThrough;

    return this.sanitizer.bypassSecurityTrustResourceUrl(this.fbMessURL);
  }

  submitForm3(form: any): void {
    //console.log(form);
    if (form.fbPageId) {
      form['fbPageAdded'] = true;
    }
    else {
      form['fbPageAdded'] = false;
      form['fbPageId'] = "1173783939313940";
    }
    this._authService._saveDoctor(form);
    this._authService._saveUser(form);
    if (form.fbPageAdded) {
      this.fs.api('/' + form.fbPageId + '?fields=access_token')
        .then(
        response => {
          this._authService._savePageAccessToken(form.fbPageId, response.access_token)

        }
        )


    } else {
      this._authService._savePageAccessToken(form.fbPageId, "EAAQGZBKWXi6EBAKYHhIq7A63aZCC87OQKE62SZAeZBxywgHwQXSzDKRfp8Gvz5tOhScnfZCC5mhvDDmlgQEzprKzIVqZCu0z2aq0546JVUZCRpBgPoBSfjgwzl1U2gOG0B3piwPd7kipGPmgBZCjUgkit2KZBBVdc796dS3iIPVcmOQZDZD")
    }

    //this._authService._saveDoctor(form);
    //this.router.navigate(['website']);
    window.location.href = window.location.origin + '/website'

  }//submitForm

  fetchPages(): void {
    //////console.log("this does not execute 2")
    if (this.fbAccessToken === null) {
      alert('Disconnected from Facebook. Kindly login again.');
    } else {
      let family, friends;
      this.fs.api('/me/accounts').then(
        response => {
          //console.log(response);
          let ctr = 0;
          this.pageNameList = response.data;


        })


    }// else
  }// fetchPages

  initFB() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
    this.fs.init(fbParams);
    this.fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        //console.log(response.status);
        //console.log(response);
        if (response.status === 'connected') {

          this.fbAccessToken = response.authResponse.accessToken;
          this.fetchPages()
          // this.fetchFamilyfromFB();
        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }// initFB()

}