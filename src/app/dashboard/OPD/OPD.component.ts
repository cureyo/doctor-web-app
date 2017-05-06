import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { OutPatientsFormComponent } from '../OutPatients/OutPatientsForm.component'

declare var $: any

@Component({
  selector: 'opd-cmp',
  templateUrl: 'OPD.component.html',
  moduleId: module.id
})

export class OPDComponent implements OnInit {
  [name: string]: any;

  private caredone: any;
  private outPatient: FormGroup;
  private selectOutPatient: boolean = false;
  private routeparam: any;
  private doctorId: any;
  private userId: any;


  constructor(private _fb: FormBuilder, private _authService: AuthService, private router: Router, private http: Http,
    private patient: OutPatientsFormComponent) {


  }

  ngOnInit() {
    //console.log("ngonint")
    this.outPatient = this._fb.group({
      message: [''],

    });
    this.selectOutPatient = true;
  }
  startOPD() {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var today = dd + '-' + mm + '-' + yyyy;
    //console.log(today)

    this._authService._getUser()
      .subscribe(
      data => {

        this._authService._fetchUser(data.user.uid)
          .subscribe(res => {
            //console.log(res)
            var clinicDomain = res.clinicWebsite;
            var n = clinicDomain.indexOf('.');
            var clinicID = clinicDomain.substring(0, n);
            //console.log("my clinic id is ", clinicID)
            //console.log(clinicID)
            this._authService._getClinicQueue(clinicID, today)
              .subscribe(queue => {
                //console.log(queue)
                let q = 0;
                if (queue.$value == null) {
                  $.notify({
                    icon: "notifications",
                    message: "No patients in queue currently"

                  }, {
                      type: 'cureyo',
                      timer: 4000,
                      placement: {
                        from: 'top',
                        align: 'right'
                      }
                    });
                } else {
                  q = queue.$value;
                  this._authService._getCheckInDetails(clinicID, today, q)
                    .subscribe(data => {

                      //console.log("response data ", data);
                      //console.log('redirecting to ', 'out-patients/' + data.$value);

                      this.router.navigate(['out-patients/' + data.$value])

                    })
                }
              });
          });
      })

  }
}


