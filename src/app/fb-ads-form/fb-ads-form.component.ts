import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams,FacebookApiMethod } from 'ng2-facebook-sdk';
import {ActivatedRoute, Router} from "@angular/router";
import { AppConfig } from '../config/app.config';

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
  constructor(private _fb: FormBuilder, 
              private _authService: AuthService,  
              private route: ActivatedRoute,
              private router: Router,
              private _fs: FacebookService) { 
              
              }

  ngOnInit() {
      this.initFB();
      this._authService._getUser()
      .subscribe(userResponse=>{
        this.userID=userResponse.user.uid;
         console.log("user Response",this.userID);
         this._authService.getUserfromUserTable(this.userID)
         .subscribe(userTable=>{
           this.pageID=userTable.fbPageId;
           this.adAccountID=userTable.adaccounts;
           console.log("page id and adaccount id :",this.pageID,this.adAccountID);
            this.reForm( this.pageID,this.adAccountID);
         })
      })
      this.fbAdsForm=this._fb.group({
                  adAccount:[,Validators.required],
                  pageID:[,Validators.required],
                  BID:[,Validators.required],
                  name:[,Validators.required],
                  targetingSpec:[,Validators.required],
                  siteLink:[,Validators.required],
                  caption:[,Validators.required],
                  msg:[,Validators.required],
                  callToAction:[,Validators.required],
                  title:[,Validators.required],
                  body:[,Validators.required],
                  url:[,Validators.required]
                  });
       
    
  }
   reForm( pageID,adAccountID){
      console.log("its called::",pageID);
     this.fbAdsForm=this._fb.group({
      adAccount:[,Validators.required],
      pageID:[,Validators.required],
      BID:[,Validators.required],
      name:[,Validators.required],
      targetingSpec:[,Validators.required],
      siteLink:[,Validators.required],
      caption:[,Validators.required],
      msg:[,Validators.required],
      callToAction:[,Validators.required],
      title:[,Validators.required],
      body:[,Validators.required],
      url:[,Validators.required]
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
       //here save servie will involke
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
    
    this._authService.doclogin()
      .then(data => {
        this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
         console.log("reponse for access token:",response);
       this._fs.api('/me?fields=adaccounts')
            .then(response=>{
             //  console.log("user response data is :",response);
               this.userID=response.id; //user ID
              this.adAccountID=response.adaccounts.data[0].id; //AdAccoundId
             // this.fbAdsObject.adAccountID=this.adAccountID;
               console.log("this is the userId",this.userID);
               console.log("fb ad account details is :",this.adAccountID);
                this._authService._getPageID(this.userID)
                .subscribe(pageID =>{
                     this.pageID=pageID.$value; //page id
                    //this.fbAdsObject.pageID=this.pageID;
                    console.log("this is the user page id:",this.pageID);


                    // create campaign service
                    this._fs.api('/'+this.adAccountID
                    +'/'+'campaigns?&name=My campaign&objective=LINK_CLICKS', method)
                    .then(Data=>{
                      this.campaignID=Data.id;
                      
                      console.log("the campaign response is :",this.campaignID,typeof this.campaignID);  
                      //varify campaign
                    this._fs.api('/'+'search?type=adinterest&q=health')
                    .then(data=>{
                        console.log("response of varified campaign:",data);
                       //this.fbAdsObject.bidAmount=this.bidAmount; 
                        //targeting spec
                    this._fs.api('/'+this.adAccountID 
                    +'/'+'adsets?&name=My Ad Set'+
                    '&'+'optimization_goal=REACH'+
                    '&'+'billing_event=IMPRESSIONS'+
                    '&'+'bid_amount='+this.bidAmount+
                    '&'+'daily_budget='+this.dailybudget+
                    '&'+'campaign_id=' +this.campaignID+
                    '&'+'targeting={"geo_locations":"'+{"countries":[job['targetingSpec']]}+'"}'+
                    '&'+'start_time=2017-04-24T18:23:34+0000'+
                    '&'+'end_time=2017-12-01T18:23:34+0000&status=PAUSED',method)
                             
                    .then(response=>{
                      this.targetResponse=response.id;
                     // this.fbAdsObject.targetResponse=this.targetResponse;
                      console.log("targeting spec response",this.targetResponse);
                      this._fs.api('/' + this.adAccountID +
                      '/ads?adset_id='+this.targetResponse+
                      '&status=ACTIVE'+
                      '&name=test ad'+
                      '&bid_amount='+this.bidAmount+
                      '&creative={"title":"'+job['title']+',"body":'+job['body']+',"object_url":"https://cureyo.com","image_url":'+job['url']+'}',method)
                       .then(response1=>{
                          console.log("ads response:",response1);
                         })                     
                      })      
                    })
                  })           
                });                      
              })
            });
            
         }) ;    
       //end of messy code 

  }
  
  
  }
      

