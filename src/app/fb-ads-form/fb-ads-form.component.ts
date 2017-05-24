import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookApiMethod } from 'ng2-facebook-sdk';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from '../config/app.config';
import { FileUploader, FileUploadModule, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FirebaseApp, FirebaseRef } from 'angularfire2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { ImageSearchComponent } from './image-search/image-search.component'
declare var jquery;
declare var $: any
@Component({
  selector: 'app-fb-ads-form',
  templateUrl: './fb-ads-form.component.html',
  styleUrls: ['./fb-ads-form.component.css']
})
export class FbAdsFormComponent implements OnInit {
  @ViewChild(ImageSearchComponent) imgSearchCmp: ImageSearchComponent;
  public fbAdsForm: FormGroup;
  private fbAdsAdded: boolean = false;
  private section: any = "facebook";
  public adAccountID: any;
  private citiesReady: boolean = false;
  private waiting: boolean = false;
  private pageIdSelected: any;
  private pageImagesUrl: any;
  private imgReady: boolean = true;
  private endDateReady: boolean = true;
  public userID: any;
  public pageID: any;
  private strtDte: any;
  private endDte: any;
  public campaignID: any;
  public bidAmount: Number;
  public dailybudget: Number;
  public targetResponse: any;
  public fbAccessToken: any;
  public clinicID: any;
  public minDate: any;
  public maxDate: any;
  private endMinDate: any;
  private qLength: number = 0;
  private currentAdsList: any = [];
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public adAccountMissing: boolean = false;
  public pageMissing: boolean = false;
  public formReady: boolean = false;
  public urlAdded: boolean = false;
  private textval: any = [];
  private pageNameList: any = [];
  public filename: any;
  public storedflag: boolean = false;
  public fileUrl: any;
  private defaultImgSearch: any;
  private imgSearchType: any = "google";
  private savePath: any;
  public tempAdaccountId: any = [];
  private pagePhotos: any = [];
  private objectives: any = [];
  private cityList: any = [];
  private tgtSpecList: any = [];
  private ageGroup: any = [];
  private citySearched: boolean = false;
  private adPreview: any;
  private previewURL: any;
  private fullModel: any;
  private previewReady: boolean = false;
  private nextButtonFlag:boolean=false;
  private doneModal: boolean = false;
  storage: any;
  uploader: FileUploader = new FileUploader({ url: '' });
  uid: string;
  ref: any;
  constructor( @Inject(FirebaseApp) firebaseApp: any, @Inject(FirebaseRef) fb,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _fs: FacebookService,
    private http: Http,
    public sanitizer: DomSanitizer) {
    this.storage = firebaseApp.storage();
    this.ref = fb.database().ref();
  }

  ngOnInit() {
     this.route.params.subscribe(
            params => {
            
            this.route.queryParams.subscribe(
             qParam=> {
               if (qParam['onboarding']=="yes") {
                 this.nextButtonFlag=true;
               }
             }
            )
            //console.log("param value test:",this.routeparam);
            //end of param
          });
     
    let mS2, ddS2;
    var sDate = new Date();
    var mS = sDate.getMonth() + 1;

    var ddS = sDate.getDate();
    var yearS = sDate.getFullYear();
    if (mS < 10)
      mS2 = "0" + mS;
    else
      mS2 = mS.toString();
    if (ddS < 10)
      ddS2 = "0" + ddS;
    else
      ddS2 = ddS.toString();

    this.minDate = yearS + "-" + mS2 + "-" + ddS2;
    this.endMinDate = this.minDate;
    console.log(this.minDate)
    let i = 18;
    for (i = 18; i < 66; i++) {
      this.ageGroup[i - 18] = i;
    }
 let mE2, ddE2;
    var eDate = new Date(sDate.getTime() + 7*86400000);
    var mE = sDate.getMonth() + 1;

    var ddE = eDate.getDate();
    var yearE = eDate.getFullYear();
    if (mE < 10)
      mE2 = "0" + mE;
    else
      mE2 = mE.toString();
    if (ddE < 10)
      ddE2 = "0" + ddE;
    else
      ddE2 = ddE.toString();

    this.maxDate = yearE + "-" + mE2 + "-" + ddE2;
    console.log(this.minDate);
    let mT3, ddT3;
    var tDate = new Date(sDate.getTime() + 86400000);
    var mT = tDate.getMonth() + 1;

    var ddT = tDate.getDate();
    var yearT = tDate.getFullYear();
    if (mT < 10)
      mT3 = "0" + mT;
    else
      mT3 = mT.toString();
    if (ddT < 10)
      ddT3 = "0" + ddT;
    else
      ddT3 = ddT.toString();

    this.endMinDate = yearT + "-" + mT3 + "-" + ddT3;
    console.log(this.minDate)


    this.objectives = [
      { cta: "LIKE_PAGE", objective: "PAGE_LIKES", name: "Page Likes" },
      { cta: "CONTACT_US", objective: "LINK_CLICKS", name: "Contact Us" },
      { cta: "LEARN_MORE", objective: "LINK_CLICKS", name: "Learn More" },
      { cta: "REGISTER_NOW", objective: "LINK_CLICKS", name: "Register Now" }
    ]
    var date = new Date();
    console.log("today date:", date)


    this._authService._getUser()
      .subscribe(userResponse => {
        console.log("this is userresponse all:", userResponse);
        this.userID = userResponse.user.uid;
        console.log("user Response", this.userID);
        this._authService.getUserfromUserTable(this.userID)
          .subscribe(userTable => {
            this._authService._getFbAdsFormData(this.userID)
              .subscribe(
              adsData => {
                let ctr = 0;
                console.log(adsData);
                this.currentAdsList = adsData;
                console.log("******",this.currentAdsList[0])
                
                // for (let each of adsData) {
                //   if (each != '$key' && each !='$exists')
                //   {this.currentAdsList[ctr] = adsData[each];
                //   ctr++;}
                // }
                if (userTable.adaccounts) {
                  this.adAccountID = userTable.adaccounts;
                  for (var i = 0; i < this.adAccountID.length; i++)
                    this.tempAdaccountId[i] = this.adAccountID[i].id;
                }
                console.log("this is usertable response:", userTable);
                this.clinicID = userTable.clinicWebsite;
                this.initFB(userTable.fbPageId);
                this.clinicID = userTable.clinicWebsite.indexOf(".");
                if (this.clinicID == -1) {
                  this.clinicID = userTable.clinicWebsite.length;
                };

                this.clinicID = userTable.clinicWebsite.substring(0, this.clinicID);
                this.clinicID = "http://" + this.clinicID + ".cureyo.com";
                console.log("Clinic ID", this.clinicID);
                this.pageID = userTable.fbPageId;


                console.log("this.currentAdsList", this.currentAdsList);
              }
              )



            // this.reForm(this.pageID, this.adAccountID, this.clinicID);

          });



      })

window.scrollTo(0, 0);
          var elmnt = document.getElementById("fbPageTop");
    // console.log(elmnt);
    elmnt.scrollIntoView();
  }
  // reForm(pageID, adAccountID, clinicID) {

  //   console.log("its called::", pageID);
  //   this.fbAdsForm = this._fb.group({
  //     adAccount: [, Validators.required],
  //     pageID: [this.pageID, [Validators.required]],
  //     BID: ['10', Validators.required],
  //     budget: ['100', Validators.required],
  //     name: [, Validators.required],
  //     targetCountry: ['IN', Validators.required],
  //     targetCitySearch: [],
  //     targetCity: [, Validators.required],
  //     siteLink: [clinicID, Validators.required],
  //     caption: [, Validators.required],
  //     msg: [, Validators.required],
  //     callToAction: [, Validators.required],
  //     subtext: [, Validators.required],
  //     startdate: [, Validators.required],
  //     enddate: [, Validators.required],
  //     max_age: ['65', Validators.required],
  //     min_age: ['18', Validators.required],
  //     targetingSpecs: [],
  //     targetingSpecSearch: [],
  //     imageURL: [],
  //     imgSearch: [],
  //     showForm: []
  //   });
  //   this.formReady = true;
  // }
  changeShownAd(i) {
    let data = this.currentAdsList[i], imgURL, adAcct, pageIdtemp, startDate, endDate, targetCityA, targetCityArr = [];
    this.formReady = false;
    console.log("its called::", data);
    console.log(data.adAccount);
    console.log(this.tempAdaccountId);
    this.imgReady = false;
    this.defaultImgSearch = data.name;
    
  //  if (data.imageURL == "NA") {
  //     //console.log(this.tempAdaccountId[0])
  //     imgURL = this.imgSearchCmp.imgSelected;

  //   } else {
  //     //console.log(data.adAccount)
  //     imgURL = data.imageURL;
  //   }

    if (!data.adAccount || data.adAccount == "NA") {
      console.log(this.tempAdaccountId[0])
      adAcct = this.tempAdaccountId[0].id

    } else {
      console.log(data.adAccount)
      adAcct = data.adAccount
    }
    if (data.pageID || data.pageID != "NA") {
      pageIdtemp = data.pageID
    } else {
      pageIdtemp = this.pageNameList[0]
    }
    var date = new Date();
    if (data.startdate == "NA") {
      let m2A, dd2A;
      var m = date.getMonth() + 1;
      var dd = date.getDate();
      var year = date.getFullYear();
      if (m < 10)
        m2A = "0" + m;
      else
        m2A = m.toString();
        if (dd < 10)
        dd2A = "0" + dd;
      else
        dd2A = dd.toString();
        
      startDate = year + "-" + m2A + "-" + dd2A;
      this.strtDte = startDate
    } else  {
      startDate = data.startdate;
      this.strtDte = startDate;
    } 
    console.log(data.enddate);
    if (data.enddate == "NA") {

          let m2B, dd2B;
      var date4 = new Date();
      var date3 = date4.getTime();
      console.log(7 *  86400000)
      var date2 = new Date(date3 + 7 * 86400000);
      console.log(date2);
      var m2 = date2.getMonth() + 1;
      var dd2 = date2.getDate();
      var year2 = date2.getFullYear();
      if (m < 10)
        m2B = "0" + m2;
      else
        m2B = m2.toString();
        if (dd < 10)
        dd2B = "0" + dd2;
      else
        dd2B = dd2.toString();
     
      endDate = year2 + "-" + m2B + "-" + dd2B;
      this.endDte = endDate;
      console.log(endDate);
      console.log(this.endDte);
    } else {
  
      this.endDte = data.enddate;
      endDate = data.enddate
    }
    this.endDateReady = true;
    console.log(data.targetCitySearch);
    
    console.log(this.fbAdsForm)
    
    console.log(endDate);
    console.log(this.cityList)
    targetCityArr = this.cityList[0];
    let tgtCityVal;
    if (data.targetCity == "NA") {
      tgtCityVal = targetCityArr['key']
    } else {
      tgtCityVal = data.targetCity;
    }
   // console.log(targetCityArr['key']);
    this.fbAdsForm = this._fb.group({
      adAccount: [adAcct, Validators.required],
      pageID: [pageIdtemp, [Validators.required]],
      BID: [data.BID, Validators.required],
      budget: [data.budget, Validators.required],
      name: [data.name, Validators.required],
      targetCountry: [data.targetCountry, Validators.required],
      targetCitySearch: [data.targetCitySearch],
      targetCity: [tgtCityVal, Validators.required],
      siteLink: [data.siteLink, Validators.required],
      caption: [data.caption, Validators.required],
      msg: [data.msg, Validators.required],
      callToAction: [data.callToAction, Validators.required],
      subtext: [data.subtext, Validators.required],
      startdate: [startDate, Validators.required],
      enddate: [endDate, Validators.required],
      max_age: [data.max_age, Validators.required],
      min_age: [data.min_age, Validators.required],
      targetingSpecs: [],
      targetingSpecSearch: [data.targetingSpecSearch],
      imageURL: [imgURL],
      imgSearch: [data.imgSearch],
      showForm: i
    });
    console.log(this.fbAdsForm.controls['enddate'].value);
    console.log(this.fbAdsForm)
    this.formReady = true;
    this.imgReady = true;
  }
  initFB(pageId) {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
    console.log("this is fbparam:", fbParams);
    this._fs.init(fbParams);
    this._fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {

          this.fbAccessToken = response.authResponse.accessToken;

          this.fetchPages();
            let city = this.currentAdsList[0].targetCitySearch;
          this.searchCity(city);

        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => {console.error(error);
        if (error.error_user_msg)
        alert(error.error_user_msg);
        else if (error.message)
        alert(error.message);
      }
    );
  }// initFB()

  fetchPages(): void {
    //////console.log("this does not execute 2")
    if (this.fbAccessToken === null) {
      alert('Disconnected from Facebook. Kindly login again.');
    } else {
      let family, friends;
      this._fs.api('/me/accounts').then(
        response => {
          //console.log(response);
          let ctr = 0;
          this.pageNameList = response.data;
          console.log("this.pageNameList", this.pageNameList);
          if (this.pageNameList[0])
          this.pageIdSelected = this.pageNameList[0].id;
          console.log("this.pageIdSelected", this.pageIdSelected)
          this.fetchAdAccounts();


        })


    }// else
  }// fetchPages
  fetchAdAccounts(): void {
    //////console.log("this does not execute 2")
    if (this.fbAccessToken === null) {
      alert('Disconnected from Facebook. Kindly login again.');
    } else {

      this._fs.api('/me?fields=adaccounts')
        .then(response => {
          //  console.log("user response data is :",response);
          //this.userID = response.id; //user ID
          console.log(response)
          this.tempAdaccountId = response.adaccounts.data; //AdAccoundId
          console.log("this.tempAdaccountId", this.tempAdaccountId);
          // this.fbAdsObject.adAccountID=this.adAccountID;
          //console.log("In DoctorCheckup this is the userId", this.userID);
          console.log("In DoctorCheckup fb ad account details is :", this.adAccountID);
          console.log("First FB Page:", this.pageNameList[0])
          console.log("First Ad Account:", this.tempAdaccountId[0])
          if (this.pageNameList[0] == null || this.tempAdaccountId[0] == null) {
            if (this.pageNameList[0] == null)
              this.pageMissing = true;
            else
              this.pageMissing = false;

            if (this.tempAdaccountId[0] == null)
              this.adAccountMissing = true;
            else
              this.adAccountMissing = false;

            this.showModal();
          }
          this.changeShownAd(0);

        })


    }// else
  }// fetchPages

  save_fbAdsForm = (model) => {
    console.log(model.value);
    this.waiting = true;
    let job = model['value'];
    console.log("this is model:", job);
    this.bidAmount = job['BID'] * 100;
    this.dailybudget = job['budget'] * 100;
    job['imageURL'] = this.imgSearchCmp.imgSelected;
    console.log(job['imageURL'])
    //messy code 
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9',

    };
    let method: FacebookApiMethod = 'post';
    console.log("facebook method is :", method);
    console.log("fbparam data:", fbParams);
    this._fs.init(fbParams);


    this.adAccountID = job['adAccount'];
    console.log(job['imageURL'])
    if (job['imageURL']) {
      this.fileUrl = this.pageImagesUrl;
      this.fileUrl = encodeURIComponent(this.fileUrl)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');

    }
    this._authService._getPageID(this.userID)
      .subscribe(pageID => {
        this.pageID = pageID.$value;
        
        console.log(job);
        console.log("create campaign:", '/' + this.adAccountID
          + '/' + 'campaigns?&' + 'name=' + job['name'] + '&objective=' + this.objectives[job['callToAction']].objective)
        // create campaign service
        this._fs.api('/' + job['adAccount'] + '/campaigns?&name=' + job['name'] + '&objective=' + this.objectives[job['callToAction']].objective, method)
          .then(Data => {
            let tgt
            this.campaignID = Data.id;
            if (job['targetCity']) {
              tgt = '{"cities":[{"key":"' + job['targetCity'] + '"}]}';

            } else {
              tgt = '{"countries":["' + job['targetCountry'] + '"]}'
            }

            //varify campaign
            this._fs.api('/' + 'search?type=adinterest&q=health')
              .then(data => {
                console.log("response of varified campaign:", '/' + job['adAccount']
                  + '/' + 'adsets?&name=' + this.campaignID +
                  '&' + 'optimization_goal=LINK_CLICKS' +
                  '&' + 'billing_event=LINK_CLICKS' +
                  '&' + 'bid_amount=' + this.bidAmount +
                  '&' + 'daily_budget=' + this.dailybudget +
                  '&' + 'campaign_id=' + this.campaignID +
                  '&' + 'targeting={"geo_locations":' + tgt + '}' +
                  '&' + 'start_time=' + job['startdate'] +
                  '&' + 'end_time=' + job['enddate'] + '&status=PAUSED', method)
                this._fs.api('/' + job['adAccount']
                  + '/' + 'adsets?&name=' + this.campaignID +
                  '&' + 'optimization_goal=LINK_CLICKS' +
                  '&' + 'billing_event=LINK_CLICKS' +
                  '&' + 'bid_amount=' + this.bidAmount +
                  '&' + 'daily_budget=' + this.dailybudget +
                  '&' + 'campaign_id=' + this.campaignID +
                  '&' + 'targeting={"geo_locations":' + tgt + '}' +
                  '&' + 'start_time=' + job['startdate'] +
                  '&' + 'end_time=' + job['enddate'] + '&status=PAUSED', method)
                 
                  .then(response => {
                    this.targetResponse = response.id;
                     console.log(this.fileUrl);
                    // this.fbAdsObject.targetResponse=this.targetResponse;
                    console.log("targeting spec response", '/' + job['adAccount'] +
                      '/ads?adset_id=' + this.targetResponse +
                      '&status=ACTIVE' +
                      '&name=' + job['name'] +
                      '&bid_amount=' + this.bidAmount +
                      '&creative={"title":"' + job['name'] + '","body":"' + job['subtext'] + '","object_url":"' + job['siteLink'] + '","image_url":"' + this.fileUrl + '"}');
                    this._fs.api('/' + job['adAccount'] +
                      '/ads?adset_id=' + this.targetResponse +
                      '&status=ACTIVE' +
                      '&name=test ad' +
                      '&bid_amount=' + this.bidAmount +
                      '&creative={"title":"' + job['name'] + '","body":"' + job['subtext'] + '","object_url":"' + job['siteLink'] + '","image_url":"' + job['imageURL'] + '"}', method)
                      .then(response1 => {
                        console.log("ads response:", response1);
                        console.log(job)
                        console.log(model)
                        this.saveFbAdsFormData(job);
                      })
                  }).catch(
        error => {

            if (error.error_user_msg)
            alert(error.error_user_msg);
            else if (error.message)
            alert(error.message);
            console.log(error);
            this.waiting = false;
        }
      )
              }).catch(
        error => {

           if (error.error_user_msg)
        alert(error.error_user_msg);
        else if (error.message)
        alert(error.message);
          console.log(error);
          this.waiting = false;

        }
      )
          }).catch(
        error => {

        if (error.error_user_msg)
        alert(error.error_user_msg);
        else if (error.message)
        alert(error.message);
          console.log(error);
          this.waiting = false;

        }
      )
      });

    //end of Facebook Ads creation Code 

  }
  public fileOverBase(e: any): void {
    //console.log("fileOverBase :", e);
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    //console.log("FileOverAnother", e);
    this.hasAnotherDropZoneOver = e;
  }
  // onUpload(item) {
  //   console.log("item val:", item);
  //   const timestamp: number = new Date().getTime();
  //   this.filename = item.file.name;
  //   console.log("file name", this.filename);
  //   console.log("fileref console", `images/${this.filename}`);
  //   const fileRef: any = this.storage.ref(`images/${this.filename}`);
  //   console.log("fileref", fileRef);
  //   console.log("uploadTask url", this.uploader.queue[this.uploader.queue.length - 1]['_file'])
  //   const uploadTask: any = fileRef.put(this.uploader.queue[this.uploader.queue.length - 1]['_file']);
  //   console.log("uploadTask", uploadTask);

  //   uploadTask.on('state_changed',
  //     (snapshot) => console.log(snapshot),
  //     (error) => console.log(error),
  //     () => {
  //       console.log("upload task:")
  //       const data = {
  //         src: uploadTask.snapshot.downloadURL,
  //         raw: this.filename,
  //         createdFor: timestamp,
  //         createdBy: this.userID,
  //         updatedAt: timestamp,

  //       };
  //       console.log("json data:", data);
  //       let updates = {};
  //       this.storedflag = true;
  //       updates = data;
  //       this.saveFileUploadData(updates);
  //     }
  //   );
  // }
  // saveFileUploadData = (model) => {
  //   let reminder = {},
  //     job = model['value']
  //   console.log("jobs data:", job, model)
  //   reminder['addedBy'] = this.userID;
  //   reminder['fileName'] = model.raw;
  //   reminder['fileUrl'] = model.src;
  //   reminder['updatedAt'] = model.updatedAt;
  //   this.fileUrl = model.src;
  //   this.fileUrl = encodeURIComponent(this.fileUrl)
  //     .replace(/!/g, '%21')
  //     .replace(/'/g, '%27')
  //     .replace(/\(/g, '%28')
  //     .replace(/\)/g, '%29')
  //     .replace(/\*/g, '%2A')
  //     .replace(/%20/g, '+');
  //   console.log("created details reminder", reminder);
  //   this.urlAdded = true;
  //   this._authService._saveFileUploadData(this.userID, reminder)
  //     .then(responseData => {
  //       console.log("fileUplaodData is saved", responseData)
  //     })
  // }
  saveFbAdsFormData = (model) => {
    console.log(model)
    let AdsData = {},
      AdsJob = model;
    console.log("ads model", AdsJob)
    //prepare a DTO for FB Ads save
    AdsData['userId'] = this.userID;
    AdsData['campaignID'] = this.campaignID;
    AdsData['adAccount'] = AdsJob['adAccount'];
    AdsData['pageID'] = this.pageID;
    AdsData['BID'] = AdsJob['BID'];
    AdsData['budget'] = AdsJob['budget'];
    AdsData['name'] = AdsJob['name'] ;
    AdsData['refname'] = AdsJob['name'] + '[ID:' +this.campaignID + ']'
    AdsData['targetCountry'] = AdsJob['targetCountry'];
    AdsData['targetCity'] = AdsJob['targetCity'];
    AdsData['targetCitySearch'] = AdsJob['targetCitySearch'];
    AdsData['siteLink'] = AdsJob['siteLink'];
    AdsData['caption'] = AdsJob['caption'];
    AdsData['msg'] = AdsJob['msg'];
    AdsData['callToAction'] = AdsJob['callToAction'];
    AdsData['min_age'] = AdsJob['min_age'];
    AdsData['max_age'] = AdsJob['max_age'];
    AdsData['subtext'] = AdsJob['subtext'];
    AdsData['startdate'] = AdsJob['startdate'];
    AdsData['enddate'] = AdsJob['enddate'];
    AdsData['fileUrl'] = this.fileUrl;
    AdsData['imageURL'] = AdsJob['imageURL'];
    console.log("Ads reminder data:", AdsData);
    this.fbAdsAdded = true;
    //call the service for fbAds form Data
    
    this.generateAdPreview(this.fbAdsForm)
    this.fullModel = this.fbAdsForm.value;
    this.doneModal = true;
    this._authService._saveFbAdsFormData(this.userID, this.campaignID, AdsData)
      .then(responseData => {
        console.log("fbAds Data is saved :", responseData);
        this.showDoneModal();
      })

  }
  pageImageURLChange(value) {
    console.log(value);
    console.log(this.pagePhotos[value].images[0]);
    let array = this.pagePhotos[value].images;
    //console.log(value[1]);
    //value = JSON.parse(value);
    let size = 0;
    for (let img in array) {
      console.log(img)
      if (array[img].height > size) {
        size = array[img].height;
        this.pageImagesUrl = array[img].source;
        this.urlAdded = true;
      }
    }

  }
  searchCity(value) {
    // console.log(this.imgSearchCmp);
    // console.log(this.imgSearchCmp.imgSelected);
    this.citiesReady = false;
    console.log(value);
    this._fs.api('/search?location_types=["city"]&type=adgeolocation&q=' + value)
      .then(
      data => {
        console.log(data);
        this.cityList = data.data;
        this.citiesReady = true;
        console.log( this.cityList );
        //this.citySearched = true;
        //this.cityList;
      }
      ).catch(
        error => {

      if (error.error_user_msg)
      alert(error.error_user_msg);
      else if (error.message)
      alert(error.message);
      console.log(error);
      this.waiting = false;

           
        }
      )
  }
  detailedSearch(value) {
    console.log(this.tempAdaccountId);
    console.log(value);
    this._fs.api('/' + this.tempAdaccountId[0].id + '/targetingsearch?q=' + value.targetingSpecSearch)
      .then(
      data => {
        console.log(data);
        this.tgtSpecList = data.data;

      }
      )
  }
  generateAdPreview(adform) {
    console.log(adform)
    console.log(this.imgSearchCmp);
    this.previewReady = false;

    let model = adform.value;
    if (model['imageURL']) {
      this.fileUrl = this.pageImagesUrl;
      this.fileUrl = encodeURIComponent(this.fileUrl)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');

    }
    this.fileUrl = this.imgSearchCmp.imgSelected;
    console.log(this.fileUrl)
    this.previewReady = false;
    console.log(adform.value);
    //let model = adform.value;
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
    console.log("this is fbparam:", fbParams);
    this._fs.init(fbParams);
    this._fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        this.fbAccessToken = response.authResponse.accessToken;
        console.log(this.fbAccessToken)
        if (response.status === 'connected') {
          console.log(this.fileUrl)
          console.log('/' + model['adAccount'] + '/generatepreviews?ad_format=MOBILE_FEED_STANDARD&creative[object_story_spec][link_data][call_to_action][type]=' + this.objectives[model['callToAction']].cta + '&creative[object_story_spec][link_data][call_to_action][value][link]=' + model['siteLink'] + '&creative[object_story_spec][link_data][description]=' + model['subtext'] + '&creative[object_story_spec][link_data][link]=' + model['siteLink'] + '&creative[object_story_spec][link_data][message]=' + model['msg'] + '&creative[object_story_spec][link_data][name]=' + model['caption'] + '&creative[object_story_spec][link_data][picture]=' + this.fileUrl + '&creative[object_story_spec][page_id]=' + this.pageID);
          this._fs.api('/' + model['adAccount'] + '/generatepreviews?ad_format=MOBILE_FEED_STANDARD&creative[object_story_spec][link_data][call_to_action][type]=' + this.objectives[model['callToAction']].cta + '&creative[object_story_spec][link_data][call_to_action][value][link]=' + model['siteLink'] + '&creative[object_story_spec][link_data][description]=' + model['subtext'] + '&creative[object_story_spec][link_data][link]=' + model['siteLink'] + '&creative[object_story_spec][link_data][message]=' + model['msg'] + '&creative[object_story_spec][link_data][name]=' + model['caption'] + '&creative[object_story_spec][link_data][picture]=' + this.fileUrl + '&creative[object_story_spec][page_id]=' + this.pageID)
            .then(
            data => {
              console.log(data);
              var d = document.getElementById("adPreviewDiv");
              console.log(d);
              var f = document.getElementById("adDonePreviewDiv");
              console.log(d.innerHTML);
              d.innerHTML = data.data[0].body;
              console.log(data);
              f.innerHTML = data.data[0].body;
              console.log(data);
              // this.previewReady = false;
              // this.adPreview = data.data[0].body;
              // console.log(this.adPreview);

              // let strt = this.adPreview.indexOf('="');
              // let tempURL = this.adPreview.substring(strt + 2, this.adPreview.length);
              // console.log(tempURL)
              // let n = tempURL.indexOf('" width');
              // let tempURL2 = tempURL.substring(0, n);
              // this.previewURL = this.sanitizer.bypassSecurityTrustResourceUrl(tempURL2);
              // console.log(this.previewURL);
              this.previewReady = true;
            }).catch(
        error => {

           if (error.error_user_msg)
        alert(error.error_user_msg);
        else if (error.message)
        alert(error.message);
          console.log(error);
          this.waiting = false;
        }
      );
        }
      });
  }

  public showModal() {
    console.log("show modal for: ", "fbContent")


    $('#fbModal').modal('show');

    window.scroll(0, -100);
    //console.log($('#mainContent'));
    $('#fbContent').css({ position: 'fixed' });
  }
   closeModal() {

    $('#fbModal').modal('hide');
    $('#fbContent').css({ position: "" });

  }
  public showDoneModal() {
    this.doneModal = true;
    console.log("show modal for: ", "fbContent")


    $('#fbDoneModal').modal('show');

    window.scroll(0, -100);
    //console.log($('#mainContent'));
    $('#fbContent').css({ position: 'fixed' });
  }
  searchForGImages(searchQuery) {
    let searchURL = "https://www.googleapis.com/customsearch/v1?q=" + searchQuery + "&key=AIzaSyCaFpioNW2GRtBr7YvyWa_JmpIS65pMdOE&num=10&cx=017396431536091938880:snzyldd9qac&imgSize=huge"
    this.httpSGet(searchURL)
      .subscribe(data => {
        console.log(data);
      });
  }
  httpSGet(url) {
    return this.http.get(url)
      .map((res: Response) => res.json());
  }
  changeDate(value) {
    let dte2 = new Date(value);
    console.log(dte2);
    let dte3 = new Date(dte2.getTime() + 86400000);
     let m2A, dd2A;
      var m = dte3.getMonth() + 1;
      var dd = dte3.getDate();
      var year = dte3.getFullYear();
      if (m < 10)
        m2A = "0" + m;
      else
        m2A = m.toString();
        if (dd < 10)
        dd2A = "0" + dd;
      else
        dd2A = dd.toString();
        
      this.endMinDate = year + "-" + m2A + "-" + dd2A;
     //= value;
  }
  closeDoneModal() {
$('#fbDoneModal').modal('hide');
    $('#fbContent').css({ position: "" });
    this.route.queryParams.subscribe(
      params => {
        if (params['onboarding']=='yes') {
          this.router.navigate(['partners'], {queryParams: {onboarding: 'yes'}})
        }
      }
    )
  }
}




