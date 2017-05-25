import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookApiMethod } from 'ng2-facebook-sdk';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from '../../config/app.config';
import { FileUploader, FileUploadModule, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FirebaseApp, FirebaseRef } from 'angularfire2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
declare var jquery;
declare var $: any
@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent implements OnInit {
  @Input() savePath: any;
  @Input() searchType: any;
  @Input() defaultKeyWord: any;
  @Input() fbPageId: any;
  public searchImageForm: FormGroup;
  private showBorder: any = [];
  private fbAccessToken: any;
  imgSelected: any;
  private formReady: boolean = false;
  private showScroll: boolean = false;
  private showSearchTerm: boolean = false;
  private searchArray: any =[];
  private fbArray: any = [];
  private cureyoArray: any = [];
  private displayArray: any = [];
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
    console.log("image search loading");
    this.searchImageForm = this._fb.group({
      searchType: [this.searchType, Validators.required],
      searchTerm: [this.defaultKeyWord],
      finalURL: [,Validators.required]
    });
    this.changeSearchType(this.searchType);
    //console.log(this.defaultKeyWord);
    if (this.defaultKeyWord) 
    {this.searchForGImages(this.defaultKeyWord);
     this.selectImage(0);
     
    }
    if (this.fbPageId) {
      this.initFB();
    }

    this.formReady = true;
  }

  searchForGImages(searchQuery) {
    console.log(searchQuery);
    let searchQueryEdit = searchQuery + " Images";
    let searchURL = "https://www.googleapis.com/customsearch/v1?q=" + searchQueryEdit + "&key=AIzaSyCbRKrQajn5-XpRZ-DcLC4doBeCZ_xOG_A&num=10&cx=017396431536091938880:snzyldd9qac&imgSize=huge"
    this.httpSGet(searchURL)
    .subscribe( data => {
      let ctr = 0;
      //console.log(data);
      for (let item of data.items) {
        if (item.pagemap.cse_image) {
          this.searchArray[ctr] = item.pagemap.cse_image[0].src;
          this.showBorder[ctr] = false;
          //console.log("this.searchArray2", this.searchArray)
          ctr++;
        }
      }
      this.displayArray = this.searchArray;
      this.showScroll = true;
    //console.log("this.searchArray", this.searchArray);
    this.selectImage(0);
    });
    
  }
  httpSGet(url) {
    return this.http.get(url)
    .map((res: Response) => res.json());
  }
  changeSearchType(form) {
    //console.log(form);
    if (form == 'google') {
      //console.log(this.searchArray)
      this.showSearchTerm = true;
      this.showScroll = false;
      this.displayArray = this.searchArray;
    } else if (form == 'fbPage') {
       this.showSearchTerm = false;
       //console.log(this.fbArray)
       this.displayArray = this.fbArray;
       this.showScroll = true;
    }

  }
  selectImage(i) {
   //console.log(this.searchArray)
    for (let each in this.showBorder) {
      this.showBorder[each] = false;
    }
    this.imgSelected = this.searchArray[i];
    //console.log(this.imgSelected);
    this.showBorder[i] = true;
  }
    initFB() {
    let fbParams: FacebookInitParams = {
      appId: AppConfig.web.appID,
      xfbml: true,
      version: 'v2.9'
    };
    //console.log("this is fbparam:", fbParams);
    this._fs.init(fbParams);
    this._fs.getLoginStatus().then(
      (response: FacebookLoginResponse) => {
        if (response.status === 'connected') {

          this.fbAccessToken = response.authResponse.accessToken;         
          this.getPagePhotos(this.fbPageId)
        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }// initFB()
    getPagePhotos(pageId) {
    this._fs.api('/' + pageId + '/photos?type=uploaded&fields=link,id,picture,images')
      .then(
      data => {
        //console.log(data);
       let tempArray = data.data;
        this._fs.api('/' + pageId + '/photos?type=tagged&fields=link,id,picture,images')
          .then(
          data2 => {
            tempArray = tempArray.concat(data2.data);
            //console.log("tempArray", tempArray);
            let ctr = 0;
            for (let img of tempArray) {
              //console.log(img)
              this.fbArray[ctr] = img.images[0].source
              ctr++;
            }
            //console.log(this.fbArray);
            
          });
      }
      )
  }
}




