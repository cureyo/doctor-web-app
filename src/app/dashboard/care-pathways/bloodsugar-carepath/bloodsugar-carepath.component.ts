import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-bloodsugar-carepath',
  templateUrl: './bloodsugar-carepath.component.html',
  //styleUrls: ['./bloodsugar-carepath.component.css']
})
export class BloodsugarCareComponent implements OnInit {
  //@Input() patient: any;
  //@Input() user: any;
  @Input() objectId: any;
  @Input() checkType: any;
  public tbsForm: FormGroup;
  private itemAdded4: boolean = false;


  constructor(private _fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    console.log(this.checkType, "this.checkType");

    this.tbsForm = this._fb.group({
      health_matric: [this.checkType],
      Track_feq: ['daily'],
      timing: ['Morning', Validators.required],
      reportFrequency: ['Weekly', Validators.required]
    });

  }//ngOnInit()

  save_TbsData = (model) => {
    //console.log("i am here in save_Tbs");
    let reminder = {},
      job = model['value'];

    reminder['Job_By'] = '#doctorId';
    reminder['Job_For'] = '#patientId';
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
    // if (job['health_matric'] == 'Blood Sugar') {
      reviewData = { bsFreq: job['Track_feq'] };
      var self = this;
      setTimeout(
        function () {
          self._authService._saveTransactionData(reminder, self.objectId, self.checkType + 'Reminders/').then(
            res => {
              let d = res;
              //self.itemAdded3 = true;
              //console.log("response of onboarding save is",d);
            })
        }, 200
      )

      // this._authService._saveOnboardingReview(reminder, this.patient.uid, 'BloodSugar/' + transTime.getTime()).then(
      //   res => {
      //     let d = res;
      //     //console.log("response of onboarding save is", d);
      //   });
    // }
    // else {
    //   setTimeout(
    //     function () {
    //       self._authService._saveTransactionData(reminder, self.objectId, 'BloodPressureReminders/').then(
    //         res => {
    //           let d = res;
    //           //self.itemAdded3 = true;
    //           //console.log("response of onboarding save is",d);
    //         })
    //     }, 200
    //   )
    //   // reviewData = { bpFreq: job['Track_feq'] };
    //   // this._authService._saveOnboardingReview(reviewData, this.patient.uid, 'BloodPressure/' + transTime.getTime()).then(
    //   //   res => {
    //   //     let d = res;
    //   //     //console.log("response of onboarding save is", d);
    //   //   });
    // }



  }

}
