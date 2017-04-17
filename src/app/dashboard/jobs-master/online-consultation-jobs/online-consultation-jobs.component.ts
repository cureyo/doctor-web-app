import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/firebaseauth.service";
import {MedReminder} from "../../../models/medReminder.interface";
import {FbService} from "../../../services/facebook.service";


@Component({
  selector: 'app-online-consultation-jobs',
  templateUrl: './online-consultation-jobs.component.html',
  styleUrls: ['./online-consultation-jobs.component.css']
})
export class OnlineConsultationJobsComponent implements OnInit {
     
        @Input() userID:any;
        @Input() patient:any;
        @Input () timeInterval:any;
        @Input () dateInterval:any;
        @Input () caredonesDoctor:any;
    public octForm: FormGroup;
    private itemAdded6: boolean = false;
    constructor(
    private _fb: FormBuilder,
              private _fs: FbService,
              private route: ActivatedRoute,
              private _authService: AuthService,
              private router: Router

  ) { }

  ngOnInit() {
       this.octForm = this._fb.group({
      drname: [{value: '', disabled: true}],
      consultmode: ['video', [Validators.required]],
      frequency: ['monthly', [Validators.required]],
      date: ['1', [Validators.required]],
      timing: ['10:00 AM', [Validators.required]]
   });
  }

    //Save online consultation
  saveOCT = (model) => {
     console.log("doctor key check",this.caredonesDoctor.uid);
    let reminder = {},
      job = model['value'], reviewData = {};

    reminder['Job_By'] = this.userID;
    reminder['Job_For'] = this.patient.uid;
    reminder['Job_Frequency'] = job['frequency'];
    reminder['Job_Time'] = job['timing'];
    reminder['Job_Date'] = job['date'];
    reminder['Job_Type'] = "Online_Consultation";
    reminder['Consult_Mode'] = job['consultmode'];
    reminder['Doctor_Name']=this.caredonesDoctor.firstName +" "+this.caredonesDoctor.lastName;
    reviewData['Doctor'] = this.caredonesDoctor.firstName +" "+this.caredonesDoctor.lastName;
    reviewData['OnlineConsultFreq'] = job['frequency'];
    console.log("check the reminders value:",reminder);

         //save data in scheduled job
     this._authService._saveReminders(reminder).then(
        data => {
          this.itemAdded6 = true;

          setTimeout(() =>  {
           //this.router.navigate(['doctorJob']);
          },2000);
        }
      );
      //save data in onboarding Review
      var transTime = new Date();
      this._authService._saveOnboardingReview(reviewData,this.patient.uid, 'Online_Consultation/' + transTime.getTime()).then(
        res =>{
          let d=res;
          console.log("response of onboarding save is",d);
      })

      

  }//saveOCT

}
