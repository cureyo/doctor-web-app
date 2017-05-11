import { Component, OnInit,  Inject,Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams,FacebookApiMethod } from 'ng2-facebook-sdk';
import {ActivatedRoute, Router} from "@angular/router";
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
   private fbAdsAdded:boolean=false;
   public adAccountID:any;
   public userID:any;
   public pageID:any;
   public campaignID:any;
   public bidAmount:Number=8000;
   public dailybudget:Number =100000;
   public targetResponse:any;
   public fbAccessToken:any;
   public clinicID:any;
   public minDate:any;
   public maxDate:any;
   private qLength: number = 0;
   public hasBaseDropZoneOver: boolean = false;
   public hasAnotherDropZoneOver: boolean = false;
   public urlAdded:boolean=false;
   private textval: any = [];
   public filename: any;
   public storedflag:boolean=false;
   public fileUrl:any;
   public tempAdaccountId:any=[];
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
       var date=new Date();
       console.log("today date:",date)
      this.initFB();
      this._authService._getUser()
      .subscribe(userResponse=>{
        console.log("this is userresponse all:",userResponse);
        this.userID=userResponse.user.uid;
         console.log("user Response",this.userID);
         this._authService.getUserfromUserTable(this.userID)
         .subscribe(userTable=>{
           console.log("this is usertable response:",userTable);
           this.clinicID=userTable.clinicWebsite;

               this.clinicID = userTable.clinicWebsite.indexOf(".");
                if (this.clinicID == -1) {
                  this.clinicID = userTable.clinicWebsite.length;
                }
                 this.clinicID = userTable.clinicWebsite.substring(0, this.clinicID);
                 this.clinicID="http://"+this.clinicID+".cureyo.com";
                console.log("Clinic ID",this.clinicID);
           this.pageID=userTable.fbPageId;
           this.adAccountID=userTable.adaccounts;
           for (var i=0;i<this.adAccountID.length;i++)
                 this.tempAdaccountId[i]=this.adAccountID[i].id;

                 console.log("temp Adaccount Id is :",this.tempAdaccountId);
           console.log("page id and adaccount id :",this.pageID,this.adAccountID);
           this.reForm( this.pageID,this.adAccountID,this.clinicID);
         })
         
      })
      this.fbAdsForm=this._fb.group({
                  adAccount:[,Validators.required],
                  pageID:[{ value:this.pageID, disabled: true },[Validators.required]],
                  BID:[,Validators.required],
                  name:[,Validators.required],
                  targetingSpec:[,Validators.required],
                  siteLink:[this.clinicID,Validators.required],
                  caption:[,Validators.required],
                  msg:[,Validators.required],
                  callToAction:[,Validators.required],
                  title:[,Validators.required],
                  body:[,Validators.required],              
                  startdate:[,Validators.required],
                  enddate:[,Validators.required]
                });
      this.uploader.onAfterAddingFile = (fileItem) => {
      //console.log(this.uploader.queue);
      this.qLength = this.uploader.queue.length;

    }
       
    
  }
   reForm( pageID,adAccountID,clinicID){
      console.log("its called::",pageID);
     this.fbAdsForm=this._fb.group({
      adAccount:[adAccountID,Validators.required],
      pageID:[{ value:this.pageID, disabled: true },[Validators.required]],
      BID:[,Validators.required],
      name:[,Validators.required],
      targetingSpec:[,Validators.required],
      siteLink:[clinicID,Validators.required],
      caption:[,Validators.required],
      msg:[,Validators.required],
      callToAction:[,Validators.required],
      title:[,Validators.required],
      body:[,Validators.required],    
      startdate:[,Validators.required],
      enddate:[,Validators.required]
        });
      
   }
  initFB() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
     console.log("this is fbparam:",fbParams);
    this._fs.init(fbParams);
    this._fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {

          this.fbAccessToken = response.authResponse.accessToken;
        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }// initFB()
  
  save_fbAdsForm=(model)=>{
    let job = model['value'];
      console.log("this is model:",job);
      
       //messy code 
      let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9',
     
    };
    let method:FacebookApiMethod= 'post';
    console.log("facebook method is :",method);
     console.log("fbparam data:",fbParams);
    this._fs.init(fbParams);
    
 
              this.adAccountID=job['adAccount']
                this._authService._getPageID(this.userID)
                .subscribe(pageID =>{
                     this.pageID=pageID.$value;
                     console.log("create campaign:",'/'+this.adAccountID
                    +'/'+'campaigns?&'+'name='+job['name']+'&objective=LINK_CLICKS')
                    // create campaign service
                    this._fs.api('/'+job['adAccount']
                    +'/'+'campaigns?&'+'name='+job['name']+'&objective=LINK_CLICKS', method)
                    .then(Data=>{
                      this.campaignID=Data.id;
                      //varify campaign
                    this._fs.api('/'+'search?type=adinterest&q=health')
                    .then(data=>{
                        console.log("response of varified campaign:",'/'+job['adAccount']
                    +'/'+'adsets?&name='+this.campaignID+
                    '&'+'optimization_goal=REACH'+
                    '&'+'billing_event=IMPRESSIONS'+
                    '&'+'bid_amount='+this.bidAmount+
                    '&'+'daily_budget='+this.dailybudget+
                    '&'+'campaign_id=' +this.campaignID+
                    '&'+'targeting={"geo_locations":{"countries":["'+job['targetingSpec']+'"]}}'+
                    '&'+'start_time=2017-04-24T18:23:34+0000'+
                    '&'+'end_time=2017-12-01T18:23:34+0000&status=PAUSED',method);
                    this._fs.api('/'+job['adAccount'] 
                    +'/'+'adsets?&name='+this.campaignID+
                    '&'+'optimization_goal=REACH'+
                    '&'+'billing_event=IMPRESSIONS'+
                    '&'+'bid_amount='+this.bidAmount+
                    '&'+'daily_budget='+this.dailybudget+
                    '&'+'campaign_id=' +this.campaignID+
                    '&'+'targeting={"geo_locations":{"countries":["'+job['targetingSpec']+'"]}}'+
                    '&'+'start_time=2017-04-24T18:23:34+0000'+
                    '&'+'end_time=2017-12-01T18:23:34+0000&status=PAUSED',method)
                             
                    .then(response=>{
                      this.targetResponse=response.id;
                     // this.fbAdsObject.targetResponse=this.targetResponse;
                      console.log("targeting spec response",'/' + job['adAccount'] +
                      '/ads?adset_id='+this.targetResponse+
                      '&status=ACTIVE'+
                      '&name=test ad'+
                      '&bid_amount='+this.bidAmount+
                      '&creative={"title":"'+job['title']+'","body":"'+job['body']+'","object_url":"'+job['siteLink']+'","image_url":"'+this.fileUrl+'"}');
                      this._fs.api('/' + job['adAccount'] +
                      '/ads?adset_id='+this.targetResponse+
                      '&status=ACTIVE'+
                      '&name=test ad'+
                      '&bid_amount='+this.bidAmount+
                      '&creative={"title":"'+job['title']+'","body":"'+job['body']+'","object_url":"'+job['siteLink']+'","image_url":"'+this.fileUrl+'"}',method)
                       .then(response1=>{
                          console.log("ads response:",response1);
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
     console.log("fileref console",`images/${this.filename}`);
    const fileRef: any = this.storage.ref(`images/${this.filename}`);
    console.log("fileref",fileRef);
    console.log("uploadTask url",this.uploader.queue[this.uploader.queue.length-1]['_file'])
    const uploadTask: any = fileRef.put(this.uploader.queue[this.uploader.queue.length-1]['_file']);
    console.log("uploadTask",uploadTask);
    
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
        console.log("json data:",data);
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
     console.log("jobs data:",job,model)
    reminder['addedBy'] = this.userID;
    reminder['fileName'] = model.raw;
    reminder['fileUrl'] = model.src;
    reminder['updatedAt'] = model.updatedAt;
    this.fileUrl = model.src;
    this.fileUrl=encodeURIComponent(this.fileUrl)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
    console.log("created details reminder", reminder);  
     this.urlAdded=true;   
     this._authService._saveFileUploadData(this.userID,reminder)
     .then(responseData=>{
       console.log("fileUplaodData is saved",responseData)
     })          
  }
  saveFbAdsFormData=(model)=>{
       let AdsData={},
       AdsJob=model['value'];
      console.log("ads model",model)
         //prepare a DTO for FB Ads save
      AdsData['userId']=this.userID;
     AdsData['campaignID']=this.campaignID;    
     AdsData['adAccountID']=AdsJob['adAccount'];
     AdsData['pageID']=this.pageID;
     AdsData['bitAmount']=AdsJob['BID'];
     AdsData['campaignName']=AdsJob['name'];
     AdsData['targetingSpec']=AdsJob['targetingSpec'];
     AdsData['siteLink']=AdsJob['siteLink'];
     AdsData['caption']=AdsJob['caption'];
     AdsData['msg']=AdsJob['msg'];
     AdsData['callToAction']=AdsJob['callToAction'];
     AdsData['title']=AdsJob['title'];
     AdsData['body']=AdsJob['body'];
     AdsData['startTime']=AdsJob['startdate'];
     AdsData['endTime']=AdsJob['enddate'];
     AdsData['fileUrl']=this.fileUrl;
     console.log("Ads reminder data:",AdsData);
      this.fbAdsAdded=true;
     //call the service for fbAds form Data
     this._authService._saveFbAdsFormData(this.userID,this.campaignID,AdsData)
     .then(responseData=>{
       console.log("fbAds Data is saved :",responseData);
     })
    
  }
}
  

      

