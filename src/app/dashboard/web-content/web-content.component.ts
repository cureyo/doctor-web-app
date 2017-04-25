import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
//import {SlotBookingClass} from "../../models/slotBooking.interface";
@Component({
  selector: 'app-web-content',
  templateUrl: './web-content.component.html',
  styleUrls: ['./web-content.component.css']
})
export class WebContentComponent implements OnInit {
             private routeparam:any;
  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    //get the param
         this.route.params.subscribe(
            params => {
            this.routeparam= params['id'];
            
            console.log("param value test:",this.routeparam);
            //end of param
          });
  }

}