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
      this.profileTileForm = this._fb.group({
        title: [this.profileTile.title, Validators.required],
        experience: [this.profileTile.doctor.experience, Validators.required],
        qual: [this.profileTile.doctor.qual, Validators.required],
        brief: [this.profileTile.doctor.brief, Validators.required],
        name: [this.profileTile.doctor.name, Validators.required],
        text: [this.profileTile.text, Validators.required],
        image: [this.profileTile.doctor.image, Validators.required],
        bgPic: [this.profileTile.bgImage, Validators.required]
      });
    
  

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
    this._authService._saveWebContentHerotile(reminder, this.sitename).then(
      res => {
        let d = res;
        console.log("response of hero tile data", d);
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
        this.addDomain(this.sitename)

      })
  }

  addDomain(domainName) {


    this.putDomain(domainName).subscribe(data => {
      console.log(data);
      $.notify({
        icon: "notifications",
        message: "Website " + this.sitename + ".cureyo.com has been created. You can check in 30-45 minutes, or open this URL in another browser to review.",
        url: 'http://'+ this.sitename + '.cureyo.com',
        target: '_blank'
      }, {
          type: 'cureyo',
          timer: 4000,
          placement: {
            from: 'top',
            align: 'right'
          }
        });

    });



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
