import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookApiMethod } from 'ng2-facebook-sdk';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from '../config/app.config';
import { FileUploader, FileUploadModule, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FirebaseApp, FirebaseRef } from 'angularfire2';
declare var jquery;
@Component({
  selector: 'app-fb-ads-form',
  templateUrl: './fb-ads-form.component.html',
  styleUrls: ['./fb-ads-form.component.css']
})
export class FbAdsFormComponent implements OnInit {
  public fbAdsForm: FormGroup;
  private fbAdsAdded: boolean = false;
  public adAccountID: any;
  private pageImagesUrl: any;
  public userID: any;
  public pageID: any;
  public campaignID: any;
  public bidAmount: Number;
  public dailybudget: Number;
  public targetResponse: any;
  public fbAccessToken: any;
  public clinicID: any;
  public minDate: any;
  public maxDate: any;
  private qLength: number = 0;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public formReady: boolean = false;
  public urlAdded: boolean = false;
  private textval: any = [];
  public filename: any;
  public storedflag: boolean = false;
  public fileUrl: any;
  public tempAdaccountId: any = [];
  private pagePhotos: any = [];
  private objectives: any = [];
  storage: any;
  uploader: FileUploader = new FileUploader({ url: '' });
  uid: string;
  ref: any;
  constructor( @Inject(FirebaseApp) firebaseApp: any, @Inject(FirebaseRef) fb,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _fs: FacebookService) {
    this.storage = firebaseApp.storage();
    this.ref = fb.database().ref();
  }

  ngOnInit() {
    this.objectives = [
      {cta: "LIKE_PAGE", objective: "PAGE_LIKES", name: "Page Likes"},
      {cta: "CONTACT_US", objective: "LINK_CLICKS", name: "Contact Us"},
      {cta: "LEARN_MORE", objective: "LINK_CLICKS", name: "Learn More"},
      {cta: "REGISTER_NOW", objective: "LINK_CLICKS", name: "Register Now"}
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
            this.adAccountID = userTable.adaccounts;
            for (var i = 0; i < this.adAccountID.length; i++)
              this.tempAdaccountId[i] = this.adAccountID[i].id;

            console.log("temp Adaccount Id is :", this.tempAdaccountId);
            console.log("page id and adaccount id :", this.pageID, this.adAccountID);
            this.reForm(this.pageID, this.adAccountID, this.clinicID);
            this.uploader.onAfterAddingFile = (fileItem) => {
              //console.log(this.uploader.queue);
              this.qLength = this.uploader.queue.length;

            }
          });



      })
    // this.fbAdsForm = this._fb.group({
    //   adAccount: [, Validators.required],
    //   pageID: [{ value: this.pageID, disabled: true }, [Validators.required]],
    //   BID: [, Validators.required],
    //    budget: [, Validators.required],
    //   name: [, Validators.required],
    //   targetingSpec: [, Validators.required],
    //   siteLink: [this.clinicID, Validators.required],
    //   caption: [, Validators.required],
    //   msg: [, Validators.required],
    //   callToAction: [, Validators.required],
    //   title: [, Validators.required],
    //   body: [, Validators.required],
    //   startdate: [, Validators.required],
    //   enddate: [, Validators.required],
    //   imageURL: []
    // });


  }
  reForm(pageID, adAccountID, clinicID) {
    console.log("its called::", pageID);
    this.fbAdsForm = this._fb.group({
      adAccount: [, Validators.required],
      pageID: [{ value: this.pageID, disabled: true }, [Validators.required]],
      BID: [, Validators.required],
      budget: [, Validators.required],
      name: [, Validators.required],
      targetCountry: [, Validators.required],
      targetCity: [, Validators.required],
      siteLink: [clinicID, Validators.required],
      caption: [, Validators.required],
      msg: [, Validators.required],
      callToAction: [, Validators.required],
      subtext: [, Validators.required],
      startdate: [, Validators.required],
      enddate: [, Validators.required],
      imageURL: []
    });
    this.formReady = true;
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
           this._fs.api('/' + pageId + '/photos?type=uploaded&fields=link,id,picture,images')
              .then(
              data => {
                console.log(data);
                this.pagePhotos = data.data;
                this._fs.api('/' + pageId + '/photos?type=tagged&fields=link,id,picture,images')
              .then(
              data2 => {
                this.pagePhotos = this.pagePhotos.concat(data2.data);
              });
              }
              )
        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }// initFB()

  save_fbAdsForm = (model) => {
    let job = model['value'];
    console.log("this is model:", job);
    this.bidAmount = job['BID'];
    this.dailybudget = job['budget'];
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
        console.log(job['callToAction']);
        console.log("create campaign:", '/' + this.adAccountID
          + '/' + 'campaigns?&' + 'name=' + job['name'] + '&objective=' + job['callToAction'])
        // create campaign service
        this._fs.api('/' + job['adAccount'] + '/campaigns?&name=' + job['name'] + '&objective=' + job['callToAction'], method)
          .then(Data => {
            this.campaignID = Data.id;
            //varify campaign
            this._fs.api('/' + 'search?type=adinterest&q=health')
              .then(data => {
                console.log("response of varified campaign:", '/' + job['adAccount']
                  + '/' + 'adsets?&name=' + this.campaignID +
                  '&' + 'optimization_goal=REACH' +
                  '&' + 'billing_event=LINK_CLICKS' +
                  '&' + 'bid_amount=' + this.bidAmount +
                  '&' + 'daily_budget=' + this.dailybudget +
                  '&' + 'campaign_id=' + this.campaignID +
                  '&' + 'targeting={"geo_locations":{"countries":["' + job['targetCountry'] + '"], "cities":["' + job['targetCity'] + '"]}}' +
                   '&' + 'start_time=' + job['startdate'] +
                  '&' + 'end_time='  + job['enddate'] +'&status=PAUSED', method)
                this._fs.api('/' + job['adAccount']
                  + '/' + 'adsets?&name=' + this.campaignID +
                  '&' + 'optimization_goal=REACH' +
                  '&' + 'billing_event=LINK_CLICKS' +
                  '&' + 'bid_amount=' + this.bidAmount +
                  '&' + 'daily_budget=' + this.dailybudget +
                  '&' + 'campaign_id=' + this.campaignID +
                  '&' + 'targeting={"geo_locations":{"countries":["' + job['targetCountry'] + '"], "cities":["' + job['targetCity'] + '"]}}' +
                  '&' + 'start_time=' + job['startdate'] +
                  '&' + 'end_time='  + job['enddate'] +'&status=PAUSED', method)

                  .then(response => {
                    this.targetResponse = response.id;
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
                      '&creative={"title":"' + job['name'] + '","body":"' + job['subtext'] + '","object_url":"' + job['siteLink'] + '","image_url":"' + this.fileUrl + '"}', method)
                      .then(response1 => {
                        console.log("ads response:", response1);
                        this.saveFbAdsFormData(model);
                      })
                  })
              })
          })
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
  onUpload(item) {
    console.log("item val:", item);
    const timestamp: number = new Date().getTime();
    this.filename = item.file.name;
    console.log("file name", this.filename);
    console.log("fileref console", `images/${this.filename}`);
    const fileRef: any = this.storage.ref(`images/${this.filename}`);
    console.log("fileref", fileRef);
    console.log("uploadTask url", this.uploader.queue[this.uploader.queue.length - 1]['_file'])
    const uploadTask: any = fileRef.put(this.uploader.queue[this.uploader.queue.length - 1]['_file']);
    console.log("uploadTask", uploadTask);

    uploadTask.on('state_changed',
      (snapshot) => console.log(snapshot),
      (error) => console.log(error),
      () => {
        console.log("upload task:")
        const data = {
          src: uploadTask.snapshot.downloadURL,
          raw: this.filename,
          createdFor: timestamp,
          createdBy: this.userID,
          updatedAt: timestamp,

        };
        console.log("json data:", data);
        let updates = {};
        this.storedflag = true;
        updates = data;
        this.saveFileUploadData(updates);
      }
    );
  }
  saveFileUploadData = (model) => {
    let reminder = {},
      job = model['value']
    console.log("jobs data:", job, model)
    reminder['addedBy'] = this.userID;
    reminder['fileName'] = model.raw;
    reminder['fileUrl'] = model.src;
    reminder['updatedAt'] = model.updatedAt;
    this.fileUrl = model.src;
    this.fileUrl = encodeURIComponent(this.fileUrl)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+');
    console.log("created details reminder", reminder);
    this.urlAdded = true;
    this._authService._saveFileUploadData(this.userID, reminder)
      .then(responseData => {
        console.log("fileUplaodData is saved", responseData)
      })
  }
  saveFbAdsFormData = (model) => {
    let AdsData = {},
      AdsJob = model['value'];
    console.log("ads model", model)
    //prepare a DTO for FB Ads save
    AdsData['userId'] = this.userID;
    AdsData['campaignID'] = this.campaignID;
    AdsData['adAccountID'] = AdsJob['adAccount'];
    AdsData['pageID'] = this.pageID;
    AdsData['bitAmount'] = AdsJob['BID'];
    AdsData['campaignName'] = AdsJob['name'];
    AdsData['targetCountry'] = AdsJob['targetCountry'];
    AdsData['targetCity'] = AdsJob['targetCity'];
    AdsData['siteLink'] = AdsJob['siteLink'];
    AdsData['caption'] = AdsJob['caption'];
    AdsData['msg'] = AdsJob['msg'];
    AdsData['callToAction'] = AdsJob['callToAction'];
    
    AdsData['subtext'] = AdsJob['subtext'];
    AdsData['startTime'] = AdsJob['startdate'];
    AdsData['endTime'] = AdsJob['enddate'];
    AdsData['fileUrl'] = this.fileUrl;
    AdsData['imageURL'] = AdsJob['imageURL'];
    console.log("Ads reminder data:", AdsData);
    this.fbAdsAdded = true;
    //call the service for fbAds form Data
    this._authService._saveFbAdsFormData(this.userID, this.campaignID, AdsData)
      .then(responseData => {
        console.log("fbAds Data is saved :", responseData);
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
}




