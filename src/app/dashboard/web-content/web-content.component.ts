import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
//import {SlotBookingClass} from "../../models/slotBooking.interface";
@Component({
  selector: 'app-web-content',
  templateUrl: './web-content.component.html',
  //styleUrls: ['./web-content.component.css']
})
export class WebContentComponent implements OnInit {
             private routeparam:any;
             private section: any = "website";
             private onboaridng: boolean =false;
             //private nextButtonFlag:boolean=false;
  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    //get the param
        //  this.route.params.subscribe(
        //     params => {
        //     this.routeparam= params['id'];
        //     this.route.queryParams.subscribe(
        //      qParam=> {
        //        if (qParam['onboarding']=="yes") {
        //          this.onboaridng = true;
        //          this.nextButtonFlag=true;
        //        }
        //      }
        //     )
        //     //console.log("param value test:",this.routeparam);
        //     //end of param
        //   });
          window.scrollTo(0, 0);
          var elmnt = document.getElementById("webContentSec");
    // console.log(elmnt);
    elmnt.scrollIntoView();

  }

}
