import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/firebaseauth.service";
// import { MedReminder } from "../models/medReminder.interface";
import { FbService } from "../../../services/facebook.service";
import { Http } from '@angular/http';
import { AppConfig } from "../../../config/app.config";

@Component({
  selector: 'app-physicalconsultation-jobs',
  templateUrl: './physicalconsultation-jobs.component.html',
  styleUrls: ['./physicalconsultation-jobs.component.css']
})
export class PhysicalconsultationJobsComponent implements OnInit {
        @Input() userID:any;
        @Input() patient:any;
        @Input () timeInterval:any;
        @Input () dateInterval:any;
        @Input () caredonesDoctor:any;
   public pctForm: FormGroup;
   private itemAdded7: boolean = false;
   private address: Object = null;
   private pctDrName: string = '';
    constructor(
    private _fb: FormBuilder,
    private _fs: FbService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http
  ) { }

  ngOnInit() {
    this.pctForm = this._fb.group({
        frequency: ['monthly', [Validators.required]],
        date: ['1', [Validators.required]],
        timing: ['10:00 AM', [Validators.required]],

      });
  }

   savePCT = (model) => {
    let reminder = {}, reviewData = {},
      job = model['value']
      ;

    reminder['Job_By'] = this.userID;
    reminder['Job_For'] = this.patient.uid;
    reminder['Job_Frequency'] = job['frequency'];
    reminder['Job_Time'] = job['timing'];
    reminder['Job_Date'] = job['date'];
    reminder['Job_Type'] = "Physical_Consultation";
    reminder['Doctor_Name'] =this.caredonesDoctor.firstName +" "+this.caredonesDoctor.lastName;
    reviewData['PhysicalConsultDrName'] = '';
    reviewData['PhysicalConsultFreq'] = job['frequency'];
    reviewData['PhysicalConsultLocation'] = '';
    //console.log("reminder value test :",reminder);
     //save data in scheduled job
     this._authService._saveReminders(reminder).then(
        data => {
          this.itemAdded7 = true;

          setTimeout(() =>  {
           //this.router.navigate(['doctorJob']);
          },2000);
        }
      );
      //save data in onboarding Review
      var transTime = new Date();
      this._authService._saveOnboardingReview(reviewData, this.patient.uid, 'Physical_Consultation/' + transTime.getTime()).then(
        res =>{
          let d=res;
          //console.log("response of onboarding save is",d);
      })

  }//savePCT
}
