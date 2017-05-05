import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/firebaseauth.service";
import { FbService } from "../../../../services/facebook.service";
import { Http, Response, Headers } from '@angular/http';
declare var $: any;
@Component({
  selector: 'app-herotiles',
  templateUrl: './herotiles.component.html',
  //styleUrls: ['./herotiles.component.css']
})
export class HerotilesComponent implements OnInit {
  @Input() herotiles: any;
  @Input() routeparam: any;
  private heroTile: FormGroup;
  private heroTileAdded: boolean = false;
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
    if (this.herotiles) {
      // console.log("herotiles data in herotiles component",this.herotiles);
      this._authService._getUser()
      .subscribe(
        data => {
          this.heroTile = this._fb.group({
        title: [this.herotiles.title, Validators.required],
        expo: [this.herotiles.card.experience, Validators.required],
        qual: [this.herotiles.card.qual, Validators.required],
        about: [this.herotiles.card.text, Validators.required],
        card_title: [this.herotiles.card.title, Validators.required],
        site_text: [this.herotiles.text, Validators.required],
        fb_Profile: ['https://graph.facebook.com/' + data.user.uid + '/picture?type=large', Validators.required],
        bg_Pic: [this.herotiles.bgImage, Validators.required]
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
    //console.log(job);
    let job = model['value'];
    console.log(job);
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
    console.log(reminder);
    this.heroTileAdded = true;
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
