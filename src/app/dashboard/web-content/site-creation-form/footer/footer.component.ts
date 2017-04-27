import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/firebaseauth.service";
import {FbService} from "../../../../services/facebook.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
   @Input () routeparam:any;
   private footerTile:FormGroup;
  private footerTileAdded:boolean=false;
   private sitename:any;
  constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router
  ) { }

  ngOnInit() {
       this.footerTile=this._fb.group({
      linkURL:['',Validators.required],
      twitterURL:['',Validators.required],
      facebookURL:['',Validators.required],
    });

  }//end of ngoninit

   save_footerTile=(model)=>{
    
      let reminder = {},
      job = model['value'];
      reminder['LinkedIn_URL']=job['linkURL']
      reminder['Twitter_URL']=job['twitterURL'],
      reminder['FaceBook_URL']=job['facebookURL'],
      reminder['site_Name'] =this.routeparam;
      
      this.footerTileAdded=true;
       console.log("reminder value footertile  :",reminder);
            //remove .com from url
             var n=this.routeparam.indexOf(".")
               if (n==-1){
                 n=this.routeparam.length;
               }
               this.sitename = this.routeparam.substring(0,n);
             //end of url trimming part
             console.log("the routeparam value in hero tiles:",this.sitename);
        this._authService._saveWebContentFootertile(reminder,this.sitename).then(
      res =>{
          let d=res;
          console.log("response of footer tile data",d);
      })
  }

}
