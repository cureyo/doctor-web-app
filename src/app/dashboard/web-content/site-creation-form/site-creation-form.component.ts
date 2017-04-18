import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/firebaseauth.service";
import {FbService} from "../../../services/facebook.service";
import {HerotilesComponent} from "./herotiles/herotiles.component";
import {BookingtileComponent} from "./bookingtile/bookingtile.component";

@Component({
  selector: 'app-site-creation-form',
  templateUrl: './site-creation-form.component.html',
  styleUrls: ['./site-creation-form.component.css']
})
export class SiteCreationFormComponent implements OnInit {
  private site_PrefilledData:any;
  private herotiles:any;
  private bookingtiles:any;
  constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router
  ) { }

  ngOnInit() {
   this._authService._getSitePrefilledData().
      subscribe(res=>{
        this.site_PrefilledData=res;
        this.herotiles=this.site_PrefilledData.heroTile;
        this.bookingtiles=this.site_PrefilledData.bookingTile;
        // console.log("prefilled data res",this.site_PrefilledData);
        // console.log("hero tiles data",this.herotiles);
        // console.log("booking tiles data",this.bookingtiles);
      })
  }
  

}
