import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/firebaseauth.service";
import { FbService } from "../../../../services/facebook.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookApiMethod } from 'ng2-facebook-sdk';
import { Http, Response, Headers } from '@angular/http';
import { ImageSearchComponent } from '../../../../fb-ads-form/image-search/image-search.component';
import { AppConfig } from '.../../config/app.config';
declare var $: any;
@Component({
  selector: 'app-herotiles',
  templateUrl: './herotiles.component.html',
  //styleUrls: ['./herotiles.component.css']
})
export class HerotilesComponent implements OnInit {
  @ViewChild(ImageSearchComponent) imgSearchCmp: ImageSearchComponent;
  @Input() herotiles: any;
  @Input() routeparam: any;
  private heroTile: FormGroup;
  private heroTileAdded: boolean = false;
  private temp: any;
  private sitename: any;
  private pageIdSelected: any;
  private backgrounds: any;
  private fbAccessToken: any;
  private pageNameList: any = [];
  private imgSearchType: any = "google";
  private preview: any;
  private defaultImgSearch: any;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private _fbs: FacebookService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http
  ) { }

  ngOnInit() {
    this.initFB();
    this._authService._getBackgroundImages()
      .subscribe(data => {
        this.backgrounds = data;
      });
     
    if (this.herotiles) {
      // //console.log("herotiles data in herotiles component",this.herotiles);
       this.defaultImgSearch = this.herotiles.card.qual;
      this._authService._getUser()
      .subscribe(
       
        data => {
           console.log("this.imgSearchCmp.imgSelected", this.imgSearchCmp.imgSelected)
          this.heroTile = this._fb.group({
        title: [this.herotiles.title, Validators.required],
        expo: [this.herotiles.card.experience, Validators.required],
        qual: [this.herotiles.card.qual, Validators.required],
        about: [this.herotiles.card.text, Validators.required],
        card_title: [this.herotiles.card.title, Validators.required],
        site_text: [this.herotiles.text, Validators.required],
        fb_Profile: ['https://graph.facebook.com/' + data.user.uid + '/picture?type=large', Validators.required],
        bg_Pic: [this.imgSearchCmp.imgSelected]
      });
        }
      )
      
    }
    else {
      this.heroTile = this._fb.group({
        title: ['your main title', Validators.required],
        expo: ['work experience', Validators.required],
        qual: ['your qualification', Validators.required],
        about: ["tell us something about website", Validators.required],
        card_title: ['put card title here'],
        site_text: ["write some detailed text for your site", Validators.required],
        fb_Profile: [true, Validators.required],
        bg_Pic: [false]
      });
    }

  }
  save_heroTile = (model) => {
    console.log(model);
    
    let job = model['value'];
    job['bg_Pic'] = this.imgSearchCmp.imgSelected;
    //console.log(job);
    let reminder = {
      title: job['title'],
      text: job['site_text'],
      bgImage: job['bg_Pic'],
      card: {
        experience: job['expo'],
        qual: job['qual'],
        text: job['about'],
        title: job['card_title'],
        image: job['fb_Profile']
      }
    };
    //console.log(reminder);
    this.heroTileAdded = true;
    //console.log("reminder value herotile  :", reminder);
    this.temp = Math.floor((Math.random() * 10000) + 1);
    //console.log("temp number :", this.temp);

    //remove .com from url
    var n = this.routeparam.indexOf(".")
    if (n == -1) {
      n = this.routeparam.length;
    }
    this.sitename = this.routeparam.substring(0, n);
    //end of url trimming part
    //console.log("the routeparam value in hero tiles:", this.sitename);
    this._authService._saveWebContentHerotile(reminder, this.sitename).then(
      res => {
        let d = res;
        //console.log("response of hero tile data", d);
        $.notify({
          icon: "notifications",
          message: "Details for top section have been saved"

        }, {
            type: 'cureyo',
            timer: 4000,
            placement: {
              from: 'top',
              align: 'right'
            }
          });
        //this.addDomain(this.sitename)

      })
  }

  changeSampleBG(url) {
    //console.log(url)
    this.preview = url;
    //console.log(this.preview)
  }
    initFB() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
    console.log("this is fbparam:", fbParams);
    this._fbs.init(fbParams);
    this._fbs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {

         

          this.fetchPages();
           
         

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
      this._fbs.api('/me/accounts').then(
        response => {
          //console.log(response);
          let ctr = 0;
          this.pageNameList = response.data;
          console.log("this.pageNameList", this.pageNameList);
          if (this.pageNameList[0])
          this.pageIdSelected = this.pageNameList[0].id;
          console.log("this.pageIdSelected", this.pageIdSelected)
         


        })


    }// else
  }// fetchPages
}
