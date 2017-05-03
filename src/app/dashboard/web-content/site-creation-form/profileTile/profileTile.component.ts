import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/firebaseauth.service";
import { FbService } from "../../../../services/facebook.service";
import { Http, Response, Headers } from '@angular/http';
declare var $: any;
@Component({
  selector: 'app-profileTile',
  templateUrl: './profileTile.component.html',
  //styleUrls: ['./profileTile.component.css']
})
export class ProfileTileComponent implements OnInit {
  @Input() profileTile: any;
  @Input() routeparam: any;
  private profileTileForm: FormGroup;
  private profileTileAdded: boolean = false;
  private temp: any;
  private sitename: any;
  private backgrounds: any;
  private preview: any;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http
  ) { }

  ngOnInit() {
    this._authService._getBackgroundImages()
      .subscribe(data => {
        this.backgrounds = data;
      })
   
      // console.log("herotiles data in herotiles component",this.herotiles);
      this._authService._getUser()
      .subscribe(

      data => {
        console.log(this.profileTile)
      this.profileTileForm = this._fb.group({
        title: [this.profileTile.title, Validators.required],
        experience: [this.profileTile.doctor.experience, Validators.required],
        qual: [this.profileTile.doctor.qual, Validators.required],
        brief: [this.profileTile.doctor.brief, Validators.required],
        name: [this.profileTile.doctor.name, Validators.required],
        text: [this.profileTile.text, Validators.required],
        image: ['https://graph.facebook.com/' + data.user.uid + '/picture?type=large', Validators.required],
        bgPic: [this.profileTile.bgImage, Validators.required]
      });
      });
      console.log(this.profileTileForm);
    
  

  }
  save_profileTile = (model) => {
    //console.log(job);
    let job = model['value'];
    console.log(job);
    let reminder = {
      title: job['title'],
      text: job['text'],
      bgImage: job['bgPic'],
      doctor: {
        brief: job['brief'],
        experience: job['experience'],
        qual: job['qual'],
        name: job['name'],
        image: job['image']
      }
    };
    console.log(reminder);
    this.profileTileAdded = true;
    console.log("reminder value herotile  :", reminder);
    this.temp = Math.floor((Math.random() * 10000) + 1);
    console.log("temp number :", this.temp);

    //remove .com from url
    var n = this.routeparam.indexOf(".")
    if (n == -1) {
      n = this.routeparam.length;
    }
    this.sitename = this.routeparam.substring(0, n);
    //end of url trimming part
    console.log("the routeparam value in hero tiles:", this.sitename);
    this._authService._saveWebContentProfiletile(reminder, this.sitename).then(
      res => {
        let d = res;
        console.log("response of hero tile data", d);
        $.notify({
          icon: "notifications",
          message: "Details for profile section have been saved"

        }, {
            type: 'cureyo',
            timer: 4000,
            placement: {
              from: 'top',
              align: 'right'
            }
          });
       this.updateMetaData(reminder);

      })
  }

  updateMetaData(metadata2) {
    console.log(metadata2);
    let data = metadata2;
    console.log(data);
   let metadata = {
  "description" : data.doctor.brief,
  "image" : data.doctor.image,
  "siteName" : data.doctor.name,
  "tags" : [ {
    "content" : data.doctor.brief,
    "tag" : "description",
    "type" : "name"
  }, {
    "content" : data.doctor.name + " | " + data.doctor.qual + " | " + data.doctor.experience,
    "tag" : "og:title",
    "type" : "property"
  }, {
    "content" : data.doctor.brief,
    "tag" : "og:description",
    "type" : "property"
  }, {
    "content" : data.doctor.image,
    "tag" : "og:image",
    "type" : "property"
  } ],
  "title" : data.doctor.name + " | " + data.doctor.qual + " | " + data.doctor.experience,
  "twitter" : {
    "cardImage" : "http://www.mycowichanvalleynow.com/wp-content/uploads/2016/12/surgery.jpg",
    "image" : "https://cureyo.com/assets/DoctorPics/DrUSSrinivasan.png",
    "site" : "@DrUSSrinivasan"
  },
  "url" : this.routeparam
};
this._authService._saveWebMetaData(metadata, this.sitename).then(data => {
  $.notify({
          icon: "notifications",
          message: "Website metadata has been updated"

        }, {
            type: 'cureyo',
            timer: 4000,
            placement: {
              from: 'top',
              align: 'right'
            }
          });
})


  }
  putDomain(domainName) {

    const domainURL = "https://api.digitalocean.com/v2/domains/cureyo.com/records";
    const domData = {
      "type": "A",
      "name": domainName,
      "data": "139.59.76.104",
      "priority": null,
      "port": null,
      "ttl": 600,
      "weight": null
    };


    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', `Bearer 88e99143c6783437106e779dc1f7910f0bdf1de018c2f3b809470df8bb1074f9`);

    return this.http.post(domainURL, domData, {
      headers: headers
    })
      .map((res: Response) => res.json());

  }
  changeSampleBG(url) {
    console.log(url)
    this.preview = url;
    console.log(this.preview)
  }
}
