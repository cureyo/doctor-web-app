import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../services/firebaseauth.service";
import { FbService } from "../../../../services/facebook.service";
import { slotBookingClass } from "../../../../models/slotBooking.interface";


@Component({
  selector: 'app-specializationsTile',
  templateUrl: './specializationsTile.component.html',
  //styleUrls: ['./slot-booking.component.css']
})
export class SpecializationsTileComponent implements OnInit {
  @Input() routeparam: any;
  public timeInterval: any;
  public timeValue: any;
  public dateInterval: any;
  private specializationForm: FormGroup;
  private slotAdded: boolean = false;
  private sitename: any;
  private formReady: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router
  ) {
    this.timeValue = [];
    this.timeInterval = [];
    this.dateInterval = [];
    // this.setIntervals();
  }

  ngOnInit() {
    var n = this.routeparam.indexOf(".")
    if (n == -1) {
      n = this.routeparam.length;
    }
    this.sitename = this.routeparam.substring(0, n);
    //console.log("interface class test");
    this._authService._getWebsiteSpeciaizations(this.sitename)
      .subscribe(
      webSpecData => {
        console.log(webSpecData)
        console.log(webSpecData[0])
        this.specializationForm = this._fb.group({

          specializations: this._fb.array([
            this.initSpecs(webSpecData[0])

          ])
        });

        let control = <FormArray>this.specializationForm.controls['specializations'];
        for (let each in webSpecData) {
          console.log(each);
          console.log(webSpecData[each])
          if (each != '$key' && each != '$value' && each != '$exists' && each != '0')
            control.push(this.initSpecs(webSpecData[each]));
        }
        this.formReady = true;
      }
      )



  }
  addSlot() {
    //console.log("its called addslot");
    const control = <FormArray>this.specializationForm.controls['specializations'];

    control.push(this.initSlots());

  }//addSlot
  initSpecs(data) {
    console.log(data);
    return this._fb.group({
      title: [data.title, Validators.required],
      brief: [data.brief, Validators.required],
      description: [data.description, Validators.required],
    });
  }
  initSlots() {
    //console.log("init called");
    return this._fb.group({
      title: ['', Validators.required],
      brief: ['', Validators.required],
      description: ['', Validators.required],
    });
  }//iniSlots

  save_specializationForm = (model) => {

    let job = model['value'];
    let specials = job['specializations'],
      ctr = 0,
      flag;




    this._authService._saveSpecializationDetails(specials, this.sitename)
      .then(
      data => {
        this.slotAdded = true;
        //console.log("slot booking data saved:");
      }
      );
    //end of db part code





  }//save

}
