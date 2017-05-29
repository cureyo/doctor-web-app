import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/firebaseauth.service";
import { FbService } from "../../../services/facebook.service";
import { HerotilesComponent } from "./herotiles/herotiles.component";
import { BookingtileComponent } from "./bookingtile/bookingtile.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageSearchComponent } from 'fb-ads-form/image-search/image-search.component'

@Component({
  selector: 'app-site-creation-form',
  templateUrl: './site-creation-form.component.html',
  // styleUrls: ['./site-creation-form.component.css']
})
export class SiteCreationFormComponent implements OnInit {
  @ViewChild(ImageSearchComponent) imgSearchCmp: ImageSearchComponent;

  private routeparam: any;
  private site_PrefilledData: any;
  private herotiles: any;
  private bookingtiles: any;
  private profileTile: any;
  private section: any = "website";
  private online: any = "Online";
  private physical: any = "Physical";
  private websiteLink: any;
  private sectionList: any = [];
  private showingSection: any;
  private clinicId: any;

  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
 
    this.route.params.subscribe(
      params => {
        this.routeparam = params['id'];

        //console.log("param value test in site creation form :", this.routeparam);
        var n = this.routeparam.indexOf('.')
        var pathRoute = this.routeparam.substring(0, n);
        this.clinicId = pathRoute;
        let tempURL2 = "http://" + pathRoute + ".cureyo.com/?scrollToSec=" + this.showingSection;
        this.websiteLink = this.sanitizer.bypassSecurityTrustResourceUrl(tempURL2);
        //console.log(pathRoute)
        this.showSection("heroSection")
        this._authService._getSiteData(pathRoute).
          subscribe(res => {
            this.site_PrefilledData = res;
            this.herotiles = this.site_PrefilledData.heroTile;
            this.bookingtiles = this.site_PrefilledData.bookingTile;
            this.profileTile = this.site_PrefilledData.profileTile;

          })
      });
    //end of param



  }
  showSection(section) {
    console.log(section);
    console.log(this.herotiles);
    console.log(this.bookingtiles);
    var d = document.getElementById('iFrameWeb')
    console.log(d);
    console.log(d.innerHTML);
    var n = this.routeparam.indexOf('.')
    var pathRoute = this.routeparam.substring(0, n);
    this.showingSection = section;
    
    this._authService._putScrollToSection(pathRoute, section)
    .then(
      data=> console.log(data)
    )
  
  }

}
