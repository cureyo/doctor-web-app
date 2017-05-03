import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PatientDetailFormComponent } from '../PatientDetailForm/PatientDetailForm.component';
import { PatientPreviewComponent } from "../PatientPreview/PatientPreview.component"

declare var $: any

@Component({
  selector: 'out-patients-form',
  templateUrl: 'OutPatientsForm.component.html',
  moduleId: module.id
})

export class OutPatientsFormComponent implements OnInit {
  [name: string]: any;


  private outPatient: FormGroup;
  private selectOutPatient: boolean = false;
  private details: any;
  private currentUser: any;
  private Name: any;
  private currentUserID: any;
  private caredoneId: any;
  private nickName: any;
  private caredone: any;
  private avatar: any;
  private age: any;
  private patient: any;
  private location: any;
  private hometown: any;
  private birthday: any;
  private education: any;
  private school: any;
  private School: any;
  private skulName: any;
  private schoolName: any;
  private level: any;
  private work: any;
  private Work: any;
  private WorkName: any;
  private workName: any;
  private position: any;
  private Position: any;
  private currentQ: any = 0;
  private clinicIDNew: any;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private route: ActivatedRoute, private router: Router, private http: Http) {


  }

  ngOnInit() {

    this.outPatient = this._fb.group({
      message: [''],

    });
    this.selectOutPatient = true;

    this._authService._getUser()
      .subscribe(
      data => {
        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth();
        var yyyy = date.getFullYear();
        var today = dd + '-' + mm + '-' + yyyy;
        console.log(today)

        this._authService._fetchUser(data.user.uid)
          .subscribe(res => {
            console.log(res)
            if (res) {
              this.currentUser = this._authService._getCurrentUser();
              this.currentUserID = this.currentUser.authUID
              console.log("the current user id:", this.currentUserID);
              //get the param id:
              this.route.params.subscribe(
                params => {

                  let param = params['id'];
                  //let param = "61698978";
                  this.caredoneId = param;
                  console.log(this.caredoneId, " is the cared one id")
                  this.getCaredOne(param); //find caredones
                  this.getPatientdetails(param)//find patientInsights

                  console.log(res)
                  var clinicDomain = res.clinicWebsite;
                  var n = clinicDomain.indexOf('.');
                  var clinicID = clinicDomain.substring(0, n);
                  console.log("my clinic id is ", clinicID)
                  console.log(clinicID);

                  this._authService._getClinicQueue(clinicID, today)
                    .subscribe(queue => {
                      console.log(queue)
                      let q = 0;
                      if (queue == null) { } else {
                        q = queue;
                        console.log(q);
                        this.currentQ = queue.$value;
                        this.clinicIDNew = clinicID;
                        this._authService._getCheckInDetails(clinicID, today, this.currentQ)
                          .subscribe(data => {
                            if (data != param) {
                              console.log("response data ", data);
                              console.log('redirecting to ', 'out-patients/' + data.$value);

                              this.router.navigate(['out-patients/' + data.$value])
                            }
                          });

                      }
                    });
                })

            }

          });
      });

  }

  //get param function
  getCaredOne(param) {
    console.log("ids of current user and param", this.currentUserID, param);
    this._authService._findCaredOne(this.currentUserID, param)
      .subscribe(
      data => {
        this.caredone = data;
        console.log("the caredone data :", this.caredone);
        this.nickName = this.caredone.nickName;
        this.avatar = this.caredone.avatar;
      })
  }
  getPatientdetails(param) {

    this._authService._findPatient(this.currentUserID, param)
      .subscribe(
      insights => {
        this.patient = insights
        console.log(this.patient)


        this.birthday = this.patient[0].$value;
        this.hometown = this.patient[2].name;
        this.location = this.patient[4].name;

        this.school = this.patient[1].length - 1;
        this.education = this.patient[1]
        this.schoolName = this.education[this.school].concentration
        this.level = this.schoolName[0].name
        this.School = this.education[this.school].school
        this.skulName = this.School.name;

        this.work = this.patient[5].length - 1;
        this.Work = this.patient[5];
        this.WorkName = this.Work[this.work].employer
        this.workName = this.WorkName.name
        this.position = this.Work[this.work].position
        this.Position = this.position.name
        console.log(this.workName, this.Position)

        console.log(this.work)

        this.age = calculateAge(this.patient[0].$value) - 1
        console.log("age is ", this.age)

        function calculateAge(birthday) { // birthday is a string
          console.log("dob is ", birthday)
          var birthdate = new Date();
          var nMonth = birthday.indexOf('/');
          var month = birthday.substring(0, nMonth);
          var len = birthday.length;
          var birthday2half = birthday.substring(nMonth + 1, len);
          var nDate = birthday2half.indexOf('/');
          var date = birthday2half.substring(0, nDate);
          var len2 = birthday2half.length;
          var year = birthday2half.substring(nDate + 1, len2);


          // var nDate = birthday.indexOf('/');
          // var date = birthday.substring(0, nDate);
          // var len = birthday.length;
          // var birthday2half = birthday.substring(nDate + 1, len);
          // var nMonth = birthday2half.indexOf('/');
          // var month = birthday2half.substring(0, nMonth);
          // var len2 = birthday2half.length;
          // var year = birthday2half.substring(nMonth + 1, len2);

          birthdate.setDate(date);
          birthdate.setMonth(month);
          birthdate.setFullYear(year);
          console.log(birthdate);

          var today = new Date();

          var ageDifMs = today.getTime() - birthdate.getTime(); // parse string to date

          var ageDate = new Date(ageDifMs); // miliseconds from epoch
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
      });
  }

  checkOutPatient() {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var today = dd + '-' + mm + '-' + yyyy;
    console.log(today)
    console.log(this.currentQ)
    console.log(this.currentQ + 1);
    this._authService._getCheckInDetails(this.clinicIDNew, today, this.currentQ + 1)
      .subscribe(data => {
        console.log(data);
        if (data.$value && data.$value != null)
          this._authService._setClinicQueue(this.clinicIDNew, today, this.currentQ + 1);
        else {
          $.notify({
            icon: "notifications",
            message: "Today's queue is completed"

          }, {
              type: 'cureyo',
              timer: 4000,
              placement: {
                from: 'top',
                align: 'right'
              }
            });

        }
      });
  }

}
