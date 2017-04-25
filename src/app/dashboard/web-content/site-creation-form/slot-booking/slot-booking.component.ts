import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/firebaseauth.service";
import {FbService} from "../../../../services/facebook.service";
import {slotBookingClass} from "../../../../models/slotBooking.interface";


@Component({
  selector: 'app-slot-booking',
  templateUrl: './slot-booking.component.html',
  styleUrls: ['./slot-booking.component.css']
})
export class SlotBookingComponent implements OnInit {
      public timeInterval: any;
      public timeValue: any;
      public dateInterval: any;
      private slotBookingTile:FormGroup;
      private slotAdded:boolean=false;
   constructor(
              private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router
  ) { 
    this.timeValue=[];
    this.timeInterval = [];
    this.dateInterval = [];
    this.setIntervals();
  }

  ngOnInit() {
      console.log("interface class test");
      this.slotBookingTile=this._fb.group({
       duration:['30 Min',Validators.required],
       avails: this._fb.array([
        this.initSlots()
        
      ])
     });

     
  }
    addSlot(){
    console.log("its called addslot");
    const control = <FormArray>this.slotBookingTile.controls['avails'];
     
    control.push(this.initSlots());

  }//addSlot
   
   initSlots(){
      console.log("init called");
      return this._fb.group({
        fromTime: ['',Validators.required],
        toTime: ['',Validators.required],
    });
  }//iniSlots

  //set time interval 
  setIntervals = () => {
    let hrs, md, vHrs;

    for (let i = 5; i < 24; i++) {
      if (i == 12) {
        hrs = i;
        vHrs = i;
      } else {
           
          vHrs = i;
          console.log("vhrs value",vHrs );
        hrs = i % 12;
       
      }
      if (hrs < 10) {
        hrs = "0" + hrs;
        // vHrs = "0" + hrs;
      }

      md = (i >= 12) ? ' PM' : ' AM';
      this.timeInterval.push(hrs + ":00" + md);
      this.timeValue.push(vHrs+ "00");
      this.timeInterval.push(hrs + ":30" + md);
      this.timeValue.push(vHrs + "50")
    }

    for (let i = 1; i <= 31; i++) {
      this.dateInterval.push(i);
    }

  }//setTimeInterval

   save_slotBookingTile = (model) => {

    let job = model['value'];
     let  slots = job['avails'],
      ctr = 0,
      flag;
         
    let reminders = {
      "Job_slotBucket": [],
      "Job_Duartion":job['duration'],
      "Job_Type": "Slot Availability",
      "SLots":[],

    };
     let d=job['duration'];
     let t=0;
     let slot,diff,total_time_min;
     let time:any;

    for (let i = 0; i < slots.length; i++) {
      reminders.Job_slotBucket.push({
        
        "Job_From": slots[i].fromTime,
        "Job_To": slots[i].toTime
      });
     
          diff=slots[i].toTime-slots[i].fromTime;
          total_time_min= (diff/100)*60;
          if (total_time_min>=d){
              slot=total_time_min/d;
        //  console.log("total slot in this range and selected duration for:",slot);
          
          for (let j=0;j<slot;j++)
           {     
              if(d==30 && j>0){
                  t=50+Number  (slots[i].fromTime);
              }
              else if(d==60 && j>0){
                 t=100+Number (slots[i].fromTime); 
              }
              else if(d==90 && j>0){
                t=150+Number (slots[i].fromTime);
              }
              else if(d==120 && j>0) {
                t=200+Number (slots[i].fromTime);
              }
              else{
                 t=Number (slots[i].fromTime); 
              }
              slots[i].fromTime=t;
            // console.log("t value ",t,ctr);
                 /* Convert t value into time format  */
                  let hr,hrs,min,span,t1,t2;
                      hr=Number (t/100);
                      
                        hrs=Math.round(hr-0.1);
                         // console.log("round hr value",hr);
                          min=hr-hrs;
                         // console.log("min value:",min);
                          min= Math.round(min*60);
                        
                       if(Number(t)<1200)
                       {
                         span="AM";
                       }
                       else{
                          span="PM";
                       }
                      //console.log("test the value of hr  and min and span",hrs,min,span);
                       if (min==0){
                         time= String(hrs+":"+"0"+min+" "+span);
                       }
                       else{
                          time= String(hrs+":"+min+" "+span);
                       }
                      
                       console.log("the time is ",time);
                   //end of time conversion
                reminders['SLots'][ctr]=time;
                ctr++;
           } //second for loop
            
          } //end of if
          else{
            console.log("invalid range");
          }
    } // first loop end here
      console.log("the reminders value ",reminders);
         this.slotAdded=true;

         //save data into the db
         this._authService._saveSlotBookingDetails(reminders)
      .then(
        data => {
          this.slotAdded=true;
            console.log("slot booking data saved:");
        }
      ); 
      //end of db part code
     
  }//save

}
