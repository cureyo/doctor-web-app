import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/firebaseauth.service";
import {FbService} from "../../../../services/facebook.service";

@Component({
  selector: 'app-herotiles',
  templateUrl: './herotiles.component.html',
  styleUrls: ['./herotiles.component.css']
})
export class HerotilesComponent implements OnInit {
    @Input () herotiles:any; 
    private heroTile:FormGroup;
    private heroTileAdded:boolean=false;
    
  constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router
  ) { }

 ngOnInit() {
     
      if (this.herotiles)
      { 
        // console.log("herotiles data in herotiles component",this.herotiles);
         this.heroTile=this._fb.group({
      title:[this.herotiles.title,Validators.required],
      expo:[this.herotiles.card.experience,Validators.required],
      qual:[this.herotiles.card.qual,Validators.required],
      about:[this.herotiles.card.text,Validators.required],
      card_title:[this.herotiles.card.title,Validators.required],
      site_text:[this.herotiles.text,Validators.required],
      fb_Profile:[this.herotiles.card.image,Validators.required],
      bg_Pic:[this.herotiles.bgImage,Validators.required]
    });
      }
      else{
         this.heroTile=this._fb.group({
      title:['your main title',Validators.required],
      expo:['work experience',Validators.required],
      qual:['your qualification',Validators.required],
      about:["tell us something about website",Validators.required],
      card_title:['put card title here'],
      site_text:["write some detailed text for your site",Validators.required],
      fb_Profile:[true,Validators.required],
      bg_Pic:[false]
    });
      }
    
  }
   save_heroTile=(model)=>{
    
      let reminder = {},
      job = model['value'];
      reminder['title']=job['title']
      reminder['experience']=job['expo'],
      reminder['qualification']=job['qual'],
      reminder['about']=job['about'],
      reminder['card_title']=job['card_title'],
      reminder['site_text']=job['site_text'],
      reminder['fb_profile']=job['fb_Profile'],
      reminder['bg_Pic']=job['bg_Pic']
      this.heroTileAdded=true;
       console.log("reminder value herotile  :",reminder);
        this._authService._saveWebContent(reminder,'heroTile').then(
      res =>{
          let d=res;
          console.log("response of hero tile data",d);
      })
  }
  

}
