import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
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
  constructor(private _fb: FormBuilder, 
              private _authService: AuthService,  
              private route: ActivatedRoute,
              private router: Router,
              private _fs: FacebookService) { 
              
              }

  ngOnInit() {
       
      let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.8'
    };
     console.log("fbparam data:",fbParams);
    this._fs.init(fbParams);
    
    
    this._authService.doclogin()
      .then(data => {
        this._fs.getLoginStatus().then((response: FacebookLoginResponse) => {
                
       this._fs.api('/me?fields=adaccounts')
            .then(response=>{
             //  console.log("user response data is :",response);
               this.userID=response.id;
              this.adAccountID=response.adaccounts.data[0].id;

                this._authService._getPageID(this.userID)
                .subscribe(pageID =>{
                     this.pageID=pageID.$value;
                    console.log("this is the user page id:",this.pageID);
                })
            
              console.log("this is the userId",this.userID);
              console.log("fb ad account details is :",this.adAccountID);
                           
                   });
        //get the page id 
                      
        });
         
     
      });
    

        this.fbAdsForm=this._fb.group({
      adAccount:[this.adAccountID,Validators.required],
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

}
