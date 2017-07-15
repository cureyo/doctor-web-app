import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/firebaseauth.service";
import { FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookApiMethod } from 'ng2-facebook-sdk';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from '../../config/app.config';
import { FileUploader, FileUploadModule, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FirebaseApp, FirebaseRef } from 'angularfire2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Http, Response, Headers } from '@angular/http';
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
  @Input() fbPageList: any;
  public searchImageForm: FormGroup;
  private showBorder: any = [];
  private showfbPages: boolean = false;
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
   

   
    console.log(this.fbPageList);
    console.log(this.fbPageId);
    console.log("image search loading");
    this.searchImageForm = this._fb.group({
      searchType: [this.searchType, Validators.required],
      searchTerm: [this.defaultKeyWord],
      finalURL: [,Validators.required],
      pageName:[]
    });
    this.changeSearchType(this.searchType);
    //console.log(this.defaultKeyWord);
    if (this.defaultKeyWord) 
    {this.searchForGImages(this.defaultKeyWord);
     this.selectImage(0);
     
    }
    if (this.fbPageId) {
      this.initFB(this.fbPageId);
    }

    this.formReady = true;
  }

  searchForGImages(searchQuery) {
    console.log(searchQuery);
    let searchQueryEdit = searchQuery + " Images";
    let searchURL = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=" +searchQuery + "&mkt=en-us&Subscription-Key=8ce6113423a849299fce3c2f2e1393fb"
    this.httpSGet(searchURL)
    .subscribe( data => {
      let ctr = 0;
      console.log(data);
      for (let item of data.value) {
        if (item.contentUrl) {
          let n = item.contentUrl.indexOf('&r=');
          let tempURL = item.contentUrl.substring(n + 3,item.contentUrl.length );
          console.log(tempURL, n +3);
          
          let m = tempURL.indexOf("&");
          let tempURL2 = tempURL.substring(0, m);
          console.log(tempURL2, m)
          // tempURL2 = tempURL2.replace('%3a', ':');
          // tempURL2 = tempURL2.replace('%2f/g', '/');
          this.searchArray[ctr] = decodeURIComponent(tempURL2);
          this.showBorder[ctr] = false;
          //console.log("this.searchArray2", this.searchArray)
          ctr++;
        }
      }
      this.displayArray = this.searchArray;
      this.showScroll = true;
    //console.log("this.searchArray", this.searchArray);
    this.selectImage(0);
    },
    error => {
        console.log(error);
        this.searchForGImages2(searchQuery);
      })
    
    
  }
  searchForGImages2(searchQuery) {
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
    // let headers2 = new Headers();
    // headers2.append("Ocp-Apim-Subscription-Key", "62325b43-53ef-4d53-adc3-5444719b1d22");

    return this.http.get(url)
    .map((res: Response) => res.json());
  }
  changeSearchType(form) {
    console.log(form);
    if (form.searchType == 'google') {
      //console.log(this.searchArray)
      this.showSearchTerm = true;
      this.showfbPages = false;
      this.showScroll = false;
      this.displayArray = this.searchArray;
    } else if (form.searchType == 'fbPage') {
      this.initFB(form.pageName)
       this.showSearchTerm = false;
       //console.log(this.fbArray)
       
       this.showfbPages = true;
       this.displayArray = this.fbArray;
       this.showScroll = true;
    }

  }
  selectImage(i) {
   console.log(this.searchArray)
   console.log(i);
    for (let each in this.showBorder) {
      this.showBorder[each] = false;
    }
    this.imgSelected = this.displayArray[i];
    console.log(this.imgSelected);
    // this.httpSGet(this.imgSelected)
    // .subscribe(data=> console.log(data));
    
    this.showBorder[i] = true;
  }
    initFB(pageId2) {
      console.log(pageId2)
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
          this.getPagePhotos(pageId2)
        } else {
          this.fbAccessToken = null;
        }
      },
      (error: any) => console.error(error)
    );
  }// initFB()
    getPagePhotos(pageId) {
      console.log(pageId)
    this._fs.api('/' + pageId + '/photos?type=uploaded&fields=link,id,picture,images')
      .then(
      data => {
      console.log(data);
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
  changePageList(value) {
    console.log(value)
    console.log(value.pageName)
    this.initFB(value.pageName);
  }
}




