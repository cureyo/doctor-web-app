import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../services/firebaseauth.service";
import { Router } from "@angular/router";
import { AppConfig } from '../config/app.config';
//import { DoctorCheckup } from "../models/doctorcheckup.interface";
import { FbService } from "../services/facebook.service";
import { Http, Response, Headers, Jsonp, URLSearchParams, ResponseContentType } from '@angular/http';


import { FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookApiMethod } from 'ng2-facebook-sdk';
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
  private OTPAsked: boolean = false;
  private OTPValue: any;
  private phoneNumber
  isAuth: boolean;
  buttonClicked: boolean;
  buttonClicked1: boolean;
  private currentUser: any;
  private fbAccessToken: string;
  appID: any;
  pageID: any;
  passThrough: any;
  private OTPConfirmed: boolean = false;
  private currentUserID: any;
  private times: any = 0;
  private fbMessURL: any;
  private pageNameList: any = [];
  private pageIDList: any = [];
  private pageAccesTList: any = [];
  private specialityList: any = [];
  private years: any = [];
  public adAccountID: any;
  public userID: any;
  public campaignID: any;
  public bidAmount: Number = 8000;
  public dailybudget: Number = 100000;
  public targetResponse: any;
  private diseaseList: any = [];
  private listReady: any = [];
  private fullHList: any = [];
  private clinicAddress:any;
  public  hasUserData:any;
  @ViewChild('fbCheck') fbCheckbox: ElementRef;

  private reminderKey: string = 'TestJbK_';

  constructor(
    private fb: FormBuilder,
    private _fs: FbService,
    private fs: FacebookService,
    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private _fbs: FacebookService,
    private http: Http,
    private _jsonp: Jsonp
  ) {

    this.initFB();
    console.log("its called");
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
     


    let method: FacebookApiMethod = 'post';
    console.log("In DoctorCheckup facebook method is :", method);
    //console.log("In DoctorCheckup fbparam data:",fbParams);
    this.getAllMedicalData();

   

    this.specialityList = ['Gynaecology', 'Medical Specialist', 'Orthopedics', 'Dental', 'Dermatology', 'Cardiology',]
    this._authService._getUser()
      .subscribe(
      data => {
        this.isAuth = data.isAuth;
        this.currentUser = data.user;
        this.appID = AppConfig.messenger[environment.envName].appID;
        this.pageID = AppConfig.messenger[environment.envName].pageID;
        $('#myIframe').attr('src', this.fbMessURL);
        this.passThrough = "FacbkId_" + data.user.uid;

        this._authService._fetchUser(data.user.uid)
          .subscribe(res => {
            this.hasUserData=res;
            console.log("response from the fetchuser:", this.hasUserData);
            
            if (res) {
             // this.hasUserData=res;
              this.currentUser = this._authService._getCurrentUser();
              console.log("this.hasUserData",this.hasUserData);
               
               this.signupForm = this.fb.group({


          // We can set default values by passing in the corresponding value or leave blank if we wish to not set the value. For our example, we’ll default the gender to male.
          'firstName': [ this.hasUserData.firstName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
          'lastName': [ this.hasUserData.lastName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
          'email': [ this.hasUserData.email, Validators.required],
          'avatar':  this.hasUserData.avatar,
          'experience': [ this.hasUserData.experience, Validators.required],
          'page': null,
          'phone': [this.hasUserData.phone, Validators.required],
          'clinicLocation': [ this.hasUserData.clinicLocation, Validators.required],
          'authProvider':  this.hasUserData.provider,
          'authUID':  this.hasUserData.uid,
          'address': [this.hasUserData.address],
          'mci_number': [this.hasUserData.mci_number, Validators.required],
          'speciality': [ this.hasUserData.speciality, Validators.required],
          'specializations': this.fb.array([
            this.initSpecializations()
          ]),
          'fbPageId': [''],
          'clinic': [ this.hasUserData.clinic, Validators.required],
          'qualification': [ this.hasUserData.qualification, Validators.required],
          'numberConfirmed': [, Validators.required],
          'fullName': [ this.hasUserData.fullName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        });
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
          'specializations': this.fb.array([
            this.initSpecializations()
          ]),
          'fbPageId': [''],
          'clinic': ['', Validators.required],
          'qualification': ['', Validators.required],
          'numberConfirmed': [, Validators.required],
          'fullName': ['Dr. ' + data.user.firstName + ' ' + data.user.lastName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        });
       

      console.log("this.hasUserData",this.hasUserData);
          if (this.hasUserData){
            

          }




        this.formReady = true;
        //this._fs.initFbMessenger()

        this.currentUserID = data.user.uid;
      },
      //end => { this.initFbCheckboxPlugin(this.currentUserID); }
    );
  }
  initSpecializations() {
    return this.fb.group({
     // name: ['', Validators.required],
      details: ['', Validators.required]
    });
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

  showError(item) {
    console.log("item.", item.phone);

    this.OTPValue = Math.floor((Math.random() * 1000) + 1);
    if (item.phone) {
       console.log(this.OTPValue);
      this._authService._RequestOTP(item.phone, this.OTPValue)
      this.phoneNumber = item.phone;
      this.OTPAsked = true;
       console.log(item);
    this.showErrorFlag = true;
    } else {
      this.OTPAsked = false;
      alert("Please enter phone number")
       console.log(item);
    this.showErrorFlag = false;
    }
    
   
  }
  getAddress(place:Event){
    this.clinicAddress=place;
    console.log("this is the places",this.clinicAddress);
  }
confirmOTP(otp) {
  if (otp == this.OTPValue) {
    this.OTPConfirmed = true;
    this._authService._searchPartner(this.phoneNumber)
    .subscribe(
      data => {
        console.log(data)
        for (let partner in data) {
          if (partner !='$key' && partner !='$exists' && partner !='$value')
          this._authService._savePartnerId(this.phoneNumber, this.currentUserID, partner, data[partner].category )
        }
      }
    )
  } else {
      alert("Please enter the correct OTP")
    }
}
  // getSRCurl() {
  //   this.fbMessURL = "https://www.facebook.com/v2.3/plugins/send_to_messenger.php?messenger_app_id=" + this.appID + "&page_id=" + this.pageID + "&ref=" + this.passThrough;

  //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.fbMessURL);
  // }

  submitForm3(form: any): void {
    console.log(form['specializations']);
    if (form.fbPageId) {
      form['fbPageAdded'] = true;
    }
    else {
      form['fbPageAdded'] = false;
      form['fbPageId'] = "1173783939313940";
    };
    console.log(form);
    for (let spe in form.specializations) {
     
      form.specializations[spe]['details']['toString'] = null;
      console.log(form.specializations[spe]);
    }
    if (form.fbPageAdded) {
      this.fs.api('/' + form.fbPageId + '?fields=access_token')
        .then(
        response => {
          console.log("response", response);
          this.getAccessTokenData(response.access_token)
            .subscribe(
            data => {
              console.log("page access token data: ", data);
              this.getFinalAccessToken(form.authUID, data.access_token)
                .subscribe(
                data2 => {
                  console.log(data2.data);
                  let accesToken;
                  for (let page in data2.data) {
                    console.log(data2.data[page]);
                    if (data2.data[page].id == form.fbPageId) {
                      accesToken = data2.data[page].access_token;
                    }
                  }
                  this._authService._savePageAccessToken(form.fbPageId, accesToken, this.fbAccessToken)
                    .then(
                    resp => {
                      this.fs.api('/' + form.authUID + '/adaccounts')
                        .then(
                        response2 => {

                          form['adaccounts'] = response2.data;
                          this._authService._saveDoctor(form);
                          this._authService._saveUser(form).then(
                            data => {
                              console.log(data);
                              window.location.href = window.location.origin + '/website?onboarding=yes'
                            });
                        }
                        );

                    });
                }
                )

            }
            )

        });
    } else {
      this._authService._savePageAccessToken(form.fbPageId, "EAAQGZBKWXi6EBAKYHhIq7A63aZCC87OQKE62SZAeZBxywgHwQXSzDKRfp8Gvz5tOhScnfZCC5mhvDDmlgQEzprKzIVqZCu0z2aq0546JVUZCRpBgPoBSfjgwzl1U2gOG0B3piwPd7kipGPmgBZCjUgkit2KZBBVdc796dS3iIPVcmOQZDZD", this.fbAccessToken)
      this._authService._saveDoctor(form);
      this._authService._saveUser(form).then(
        data => {
          console.log(data);
          window.location.href = window.location.origin + '/website?onboarding=yes'
        })
    }




  }//submitForm
  getAccessTokenData(tempToken) {

    const domainURL = "https://graph.facebook.com/oauth/access_token?client_id=1133564906671009&client_secret=c8806fa86f03040c405eb65196ac3ed9&grant_type=fb_exchange_token&fb_exchange_token=" + tempToken;

    return this.http.get(domainURL)
      .map((res: Response) => res.json());

  }
  getFinalAccessToken(userID, tempToken2) {

    const domainURL = "https://graph.facebook.com/" + userID + "/accounts?access_token=" + tempToken2;

    return this.http.get(domainURL)
      .map((res: Response) => res.json());

  }
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
  findDetails(item, i) {
    console.log(item);
    console.log(item.value)
    console.log(i)
    this.getMedicalDetails(item.value.name, i)
    // .subscribe(
    // data => {
    //   console.log(data);
    // });
  }
  getMedicalDetails(item, i) {
    console.log(item);
    this._authService._getTermData(item)
      .subscribe(
      data => {
        console.log(data);
        this.diseaseList[i] = data;
        if (data[0])
          this.listReady[i] = true;
        else
          this.listReady[i] = false;
      }
      )
  }
  getAllMedicalData() {

    this._authService.getAllMedicalData()
      .subscribe(
      data => {
        //this.fullHList = data;
        for (let i in data) {
          this.fullHList[i] = {name: data[i].$key , value: data[i].$key, id: data[i].id}
        }
        console.log(this.fullHList);
      }
      )
  }
  addSpecializations(form) {
    const control = <FormArray>this.signupForm.controls['specializations'];
    control.push(this.initSpecializations());

  }
}