import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/firebaseauth.service";
import { FbService } from "../../../services/facebook.service";
import { HerotilesComponent } from "./herotiles/herotiles.component";
import { BookingtileComponent } from "./bookingtile/bookingtile.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-site-creation-form',
  templateUrl: './site-creation-form.component.html',
 // styleUrls: ['./site-creation-form.component.css']
})
export class SiteCreationFormComponent implements OnInit {
  private routeparam: any;
  private site_PrefilledData: any;
  private herotiles: any;
  private bookingtiles: any;
  private profileTile: any;
  private section: any = "website";
  private online: any = "Online";
  private physical: any = "Physical";
  private websiteLink: any;

  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    //get the param
    this.route.params.subscribe(
      params => {
        this.routeparam = params['id'];

        //console.log("param value test in site creation form :", this.routeparam);
        var n = this.routeparam.indexOf('.')
        var pathRoute = this.routeparam.substring(0,n);
         let tempURL2 = "http://"+ pathRoute + ".cureyo.com";
        this.websiteLink = this.sanitizer.bypassSecurityTrustResourceUrl(tempURL2);
        //console.log(pathRoute)
        this._authService._getSiteData(pathRoute).
          subscribe(res => {
            this.site_PrefilledData = res;
            this.herotiles = this.site_PrefilledData.heroTile;
            this.bookingtiles = this.site_PrefilledData.bookingTile;
            this.profileTile = this.site_PrefilledData.profileTile;
            
            //console.log("prefilled data res",this.site_PrefilledData);
            // //console.log("hero tiles data",this.herotiles);
            // //console.log("booking tiles data",this.bookingtiles);
          })
      });
    //end of param



  }


}
