import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/firebaseauth.service";
import {FbService} from "../../../../services/facebook.service";
import { Http, Response } from '@angular/http';
@Component({
  selector: 'app-social-calendar',
  templateUrl: './social-calendar.component.html',
  //styleUrls: ['./footer.component.css']
})
export class SocialCalendarComponent implements OnInit {
  // @Input () routeparam:any;
   private socialForm:FormGroup;
  private socialFormAdded:boolean=false;
   private sitename:any;
   private articleArray: any = [];
   private articlesReady: boolean = true;
  constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router,
              private http: Http
  ) { }

  ngOnInit() {
       this.socialForm=this._fb.group({
      newsArticlesFreq:['Daily',Validators.required],
      didUKnowFreq:['Weekly',Validators.required],
      caseStudyFreq:['Monthly',Validators.required],
    });
    this._authService._getUser()
    .subscribe(
      data=> {
        this._authService._fetchUser(data.user.uid)
        .subscribe(
          user => {
            // this.getArticles(user.specializations)
            // .subscribe(
            //   articleData => {
            //     console.log(articleData);
            //     this.articleArray = articleData.posts
            //     this.articlesReady = true;
            //   }
            // )
          }
        )
      }
    )
  }//end of ngoninit
getArticles(terms) {
  let query = "", or = "";
  for (let item of terms) {
    query = query + or;
    query =  query + '"'+ item.details.name+ '"'
    or = " OR "
  }
  query = query + ""
  let url ="http://webhose.io/filterWebContent?token=214a3179-152d-4ccb-aca8-8c213c019df2&format=json&ts=1492800168017&sort=relevancy&q=" + query + "%20site_category%3Ahealth%20language%3Aenglish%20site_category%3Ahealth%20site%3A(webmd.com%20OR%20healthline.com%20OR%20nhs.co.uk)"
//let url = "http://webhose.io/filterWebContent?token=214a3179-152d-4ccb-aca8-8c213c019df2&format=json&ts=1492800168017&sort=relevancy&site_category%3Ahealth%20language%3Aenglish%20site_category%3Ahealth%20site%3A(webmd.com%20OR%20healthline.com%20OR%20nhs.co.uk)&q=" + query;
console.log(url);
return this.http.get(url).map(res=> res.json());
}
   save_socialForm=(model)=>{
    this._authService._getUser()
    .subscribe(
      data => {
        this._authService._fetchUser(data.user.uid)
        .subscribe(
          user => {
               let reminder = {},
      job = model['value'];
      reminder['newsArticlesFreq']=job['newsArticlesFreq']
      reminder['didUKnowFreq']=job['didUKnowFreq'],
      reminder['caseStudyFreq']=job['caseStudyFreq'],
      //reminder['site_Name'] =this.routeparam;
      
      this.socialFormAdded=true;
       this._authService._saveSocialCalendar(reminder, user.authUID)
      .then(res =>{
          let d=res;
          console.log(res);
          //console.log("response of footer tile data",d);
      })
          }
        )
      }
    )
   
  }

}
