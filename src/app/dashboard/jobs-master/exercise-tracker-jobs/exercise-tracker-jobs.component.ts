import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../services/firebaseauth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-exercise-tracker-jobs',
  templateUrl: './exercise-tracker-jobs.component.html',
  styleUrls: ['./exercise-tracker-jobs.component.css']
})
export class ExerciseTrackerJobsComponent implements OnInit {

      @Input() patient:any;
      @Input() user:any;
      public teForm: FormGroup;
      private itemAdded5: boolean = false;

  constructor(private _fb: FormBuilder, 
              private _authService: AuthService,  
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.teForm = this._fb.group({
      suggested_walk: ['5'],
      Track_using:['Google/Android'],
      reportFrequency: ['weekly']
    });
  }
  save_TeData = (model) => {
      //console.log("i am here in save_Te form");
      let reminder = {},
      job = model['value'];
      let reviewData = {};
     reminder['Exercise_Platform']="Exercise_Platform";
     reminder['Job_By']=this.user;
     reminder['Job_ExerciseType']="walking";
     reminder['Job_For']=this.patient.uid;
     reminder['Job_Frequency']="daily";
     reminder['Job_ReportFrequency']=job['reportFrequency'];
     reminder['Job_Time']="08:00 AM",
     reminder['Job_Type']="Exercise Tracker";
     reminder['Target_Distance'] =job['suggested_walk'];
     reminder['Track_using'] = job['Track_using'];


     reviewData = {suggestedWalk: job['suggested_walk']};
        //console.log("reminder data:",reminder);
        //save data in scheduled job
     this._authService._saveReminders(reminder).then(
        data => {
          this.itemAdded5 = true;

          setTimeout(() =>  {
           //this.router.navigate(['doctorJob']);
          },2000);
        }
      );
      //save data in onboarding Review
      var transTime = new Date();

      this._authService._saveOnboardingReview(reviewData,this.patient.uid, 'Exercise_Tracker/' + transTime.getTime()).then(
      res =>{
          let d=res;
          //console.log("response of onboarding save is",d);
      })
      
     
  }

}
