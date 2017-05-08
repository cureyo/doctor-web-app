import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-bloodsugar-jobs',
  templateUrl: './bloodsugar-jobs.component.html',
  styleUrls: ['./bloodsugar-jobs.component.css']
})
export class BloodsugarJobsComponent implements OnInit {
  @Input() patient: any;
  @Input() user: any;
  public tbsForm: FormGroup;
  private itemAdded4: boolean = false;


  constructor(private _fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    //console.log("tbs default is not coming");

    this.tbsForm = this._fb.group({
      health_matric: ['Blood Sugar'],
      Track_feq: ['daily'],
      timing: ['Morning', Validators.required],
      reportFrequency: ['weekly']
    });

  }//ngOnInit()

  save_TbsData = (model) => {
    //console.log("i am here in save_Tbs");
    let reminder = {},
      job = model['value'];

    reminder['Job_By'] = this.user;
    reminder['Job_For'] = this.patient.uid;
    reminder['Job_Frequency'] = job['Track_feq'];
    reminder['Job_ReportFrequency'] = job['reportFrequency'];
    reminder['Job_Time'] = job['timing'];
    reminder['Job_Type'] = "Device_Readings";
    reminder['Reading_Type'] = job['health_matric'];
    //console.log("reminder data:", reminder);

    //save data in scheduled job
    this._authService._saveReminders(reminder).then(
      data => {
        this.itemAdded4 = true;

        setTimeout(() => {
          //this.router.navigate(['doctorJob']);
        }, 2000);
      }
    );
    //save data in onboarding Review
    let reviewData = {};
    var transTime = new Date();
    if (job['health_matric'] == 'Blood Sugar') {
      reviewData = { bsFreq: job['Track_feq'] };

      this._authService._saveOnboardingReview(reminder, this.patient.uid, 'BloodSugar/' + transTime.getTime()).then(
        res => {
          let d = res;
          //console.log("response of onboarding save is", d);
        });
    }
    else {
      reviewData = { bpFreq: job['Track_feq'] };
      this._authService._saveOnboardingReview(reviewData, this.patient.uid, 'BloodPressure/' + transTime.getTime()).then(
        res => {
          let d = res;
          //console.log("response of onboarding save is", d);
        });
    }



  }

}
