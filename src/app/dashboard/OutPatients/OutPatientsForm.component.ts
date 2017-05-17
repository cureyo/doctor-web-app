import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { PatientDetailFormComponent } from '../PatientDetailForm/PatientDetailForm.component';
import { PatientPreviewComponent } from "../PatientPreview/PatientPreview.component"
import LineChart=require('../../../assets/js/linechart.js');
declare var $: any

@Component({
  selector: 'out-patients-form',
  templateUrl: 'OutPatientsForm.component.html',
  moduleId: module.id
})

export class OutPatientsFormComponent implements OnInit {
  [name: string]: any;


  private outPatient: FormGroup;
  private primeSymptom: any;
  private selectOutPatient: boolean = false;
  private details: any;
  private currentUser: any;
  private Name: any;
  private currentUserID: any;
  private caredoneId: any;
  private nickName: any;
  private caredone: any;
  private avatar: any;
  private patient: any;
  private age: any;
  private location: any;
  private hometown: any;
  private birthday: any;
  private education: any = [];
  private work: any = [];
  private hasAge: boolean = false;
  private hasLocation: boolean = false;
  private hasHometown: boolean = false;
  private hasEducation: boolean = false;
  private hasWork: boolean = false;
  private hasDeviations: boolean = false;
  private hasOther: boolean = false;
  private hasNormalHistory: any = [];
  private hasDeviationsHistory: any = [];
  private hasOtherHistory: any = [];
  private hasNormal: boolean = false;
  private currentQ: any = 0;
  private clinicIDNew: any;
  private dataReady: boolean = false;
  private fitnessArray: any = [];
  private tempCurrentUserID:any;
  private seriesArr:any=[];
  private labelArr:any=[];
  private fitness:any;
  private maxValues:any=0;
  private minValue:any=0;
  private title:any;
  private average:any;
  private msgDate:any;
  private hasHx: boolean = false;
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
/*************************************************************************************************** */
          //preparing  the data from the firebase for chart 
      this.tempCurrentUserID=data.user.uid;
      console.log("user and caredone ID:",this.tempCurrentUserID)
     this._authService._getPatientFitnessData(this.tempCurrentUserID)
     .subscribe(response=>{
         var temp=response;
         this.title=response.$key;
         this.title=this.title.slice(0,-7);
       console.log("responsne data for chart stage 1",temp);
       for (var i=0;i<temp.length;i++){
            this.minValue=temp[0].calories;
            var startDate=temp[0].date;
            var endDate=temp[temp.length-1].date;
            this.msgDate="from Date:"+" "+startDate+" "+"to Date:"+" "+endDate;
            var series=temp[i].calories;
            var labels=temp[i].date;
               
            //now trim the date 
           var labels=labels.slice(-2);
             console.log("trim date:",labels)
            //end of date triming 

            this.seriesArr[i]=series;
            
            if (i==0 || i==temp.length-1)
            {
            this.labelArr[i]=labels;
          }
          else 
          {
             this.labelArr[i]=" ";
          }
          
          this.labelArr[this.labelArr.length]="";
          
            //min value 
            if (this.minValue>series){
              this.minValue=series;
             
            }
            //max value
            if (this.maxValues<series){
               this.maxValues=series;
              
            }
            
           // console.log("series and lable arr:", this.seriesArr,this.labelArr[i]);
       }
         this.average=Math.round(parseInt(this.maxValues+this.minValue)/temp.length);
        
      console.log("series and lable arr:",this.labelArr,this.seriesArr,this.minValue,this.maxValues,"patientsomething");
       //call the chart.js functions 
        var t=LineChart(this.labelArr,this.seriesArr,this.minValue,this.maxValues,"patientsomething");
        this.fitness=t;
        
       // end of chart.js function call
     })
       //end of chart data preparation
/*************************************************************************************************** */
        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth();
        var yyyy = date.getFullYear();
        var today = dd + '-' + mm + '-' + yyyy;
        //console.log(today)

        this._authService._fetchUser(data.user.uid)
          .subscribe(res => {
            //console.log(res)
            if (res) {
              this.currentUser = this._authService._getCurrentUser();
              this.currentUserID = this.currentUser.authUID
              //console.log("the current user id:", this.currentUserID);
              //get the param id:
              this.route.params.subscribe(
                params => {

                  let param = params['id'];
                  this.currentQ = params['count'];
                  //let param = "61698978";
                  this.caredoneId = param;
                  //console.log(this.caredoneId, " is the cared one id")
                  this.getCaredOne(param); //find caredones
                  this.getPatientdetails(param)//find patientInsights
                  this.getPatientHistory(param)//get Medical history
                  //console.log(res)
                  var clinicDomain = res.clinicWebsite;
                  var n = clinicDomain.indexOf('.');
                  this.clinicIDNew = clinicDomain.substring(0, n);
                  //console.log("my clinic id is ", clinicID)
                  //console.log(clinicID);

                  // this._authService._getClinicQueue(clinicID, today)
                  //   .subscribe(queue => {
                  //     //console.log(queue)
                  //     let q = 0;
                  //     if (queue == null) { } else {
                  //       q = queue;
                  //       //console.log(q);
                  //       this.currentQ = queue.$value;
                  // this.clinicIDNew = clinicID;
                  // this._authService._getCheckInDetails(clinicID, today, this.currentQ)
                  //   .subscribe(data => {
                  //     if (data != param) {
                  //       console.log("response data ", data);
                  //       //console.log('redirecting to ', 'out-patients/' + data.$value);

                  //       //this.router.navigate(['out-patients/' + data.$value])
                  //     }
                  //   });

                  //   }
                  // });
                })

            }

          });
      });

  }

  //get param function
  getCaredOne(param) {
    //console.log("ids of current user and param", this.currentUserID, param);
    this._authService._findCaredOne(this.currentUserID, param)
      .subscribe(
      data => {
        this.caredone = data;
        this.dataReady = true;
        //console.log("the caredone data :", this.caredone);
        this.nickName = this.caredone.nickName;
        this.avatar = this.caredone.avatar;
        this._authService._getHxPathName(this.caredone.primeSymptom)
        .subscribe(
          data => {
            this.primeSymptom = data.path;
          }
        )
      })
  }
  getFitnessData(patientId) {
    this._authService._getHumanAPIData(patientId)
    .subscribe(
      fitnessData => {
        if (fitnessData.ActivitySummary) {
          this.fitnessArray[0] = {title: "Recent Activity", text: '', insight: '' }
          for (let item of fitnessData.ActivitySummary) {
            
          }
        }
      }
    )
  }


  getPatientHistory(param) {
    this.getFitnessData(param);
    //console.log("ids of current user and param", this.currentUserID, param);
    
    this._authService._findPatientHistory(this.currentUserID, param)
      .subscribe(
      data => {
        console.log("Patient HX Data", data);
        
        let ctrNormal = 0, ctrOther = 0, ctrDeviations = 0;
        this.hasOtherHistory = [];
        this.hasNormalHistory = [];
        this.hasDeviationsHistory = [];
        if (data[0]) {
            for (let item in data) {
          console.log(data[item]);
          this.hasHx = true;
          if (item != "$key" && item != "$exists") {
            console.log(data[item]);
            if (data[item].standard != false && data[item].standard != true && !data[item].response) {
              console.log("no response")
            }
            // else if (data[item].response == "") {
            //    console.log("no response")
            // }
            else if (data[item].standard == "NA") {
              this.hasOther = true;
              this.hasOtherHistory[ctrOther] = { question: data[item].question, response: data[item].response };
              ctrOther++;
            }
            else if (data[item].response == data[item].standard) {
              this.hasNormal = true;
              this.hasNormalHistory[ctrNormal] = { question: data[item].question, response: data[item].response };
              ctrNormal++;
            }
            else if (data[item].response != data[item].standard) {
              this.hasDeviations = true;
              this.hasDeviationsHistory[ctrDeviations] = { question: data[item].question, response: data[item].response, standard: data[item].standard };
              ctrDeviations++;
            }
          }

        }
        } else {
          this.hasHx = false;
        }
      
        console.log(this.hasNormalHistory);
        console.log(this.hasOtherHistory);
        console.log(this.hasDeviationsHistory)
      })
  }
  getPatientdetails(param) {

    this._authService._findPatient(this.currentUserID, param)
      .subscribe(
      insights => {
        this.patient = insights
        console.log(this.patient)
        this.hasAge = false;
        this.hasHometown = false;
        this.hasWork = false;
        this.hasEducation = false;
        this.hasLocation = false;

        for (let item in this.patient) {
          if (this.patient[item].$key) {
            if (this.patient[item].$key == "birthday") {
              this.birthday = this.patient[item].$value;
              this.hasAge = true;
            }
            else if (this.patient[item].$key == "hometown") {
              this.hometown = this.patient[item].name;
              this.hasHometown = true;
            } else if (this.patient[item].$key == "location") {
              this.location = this.patient[item].name;
              this.hasLocation = true;
            } else if (this.patient[item].$key == "work") {
              this.work = [];
              for (let subItem in this.patient[item]) {
                if (subItem != '$key' && subItem != '$exists')
                  this.work[subItem] = this.patient[item][subItem];
              }
              this.hasWork = true;

            } else if (this.patient[item].$key == "education") {
              this.education = [];
              for (let subItem in this.patient[item]) {
                if (subItem != '$key' && subItem != '$exists')
                  this.education[subItem] = this.patient[item][subItem];
              }
              console.log(this.education);
              this.hasEducation = true;
            }
          }
        }
        console.log(this.education);
        console.log(this.work);
        console.log(this.birthday);
        console.log(this.hometown);
        console.log(this.location);
        // if (this.patient[0]) this.birthday = this.patient[0].name;
        //  if (this.patient[2]) this.hometown = this.patient[2].name;
        //  if (this.patient[4]) this.location = this.patient[4].name;
        //  if (this.patient[1]) {
        //    this.school = this.patient[1].length - 1;
        // this.education = this.patient[1]
        //  }

        //   this.schoolName = this.education[this.school].concentration
        //   //this.level = this.schoolName[0].name
        //   this.School = this.education[this.school].school
        //   this.skulName = this.School.name;
        //   if (this.patient[5]) {
        //   this.work = this.patient[5].length - 1;
        //   this.Work = this.patient[5];
        //   }
        //   if (this.Work[this.work]) {
        //     this.position = this.Work[this.work].position;
        //      this.WorkName = this.Work[this.work].employer
        //   }
        //  if (this.WorkName) {
        //     this.workName = this.WorkName.name
        //     this.Position = this.position.name
        //  }

        //console.log(this.workName, this.Position)

        //console.log(this.work)
        console.log(this.patient[0]);
        if (this.patient[0]) {
          this.age = calculateAge(this.birthday);
        }

        //console.log("age is ", this.age)

        function calculateAge(birthday) { // birthday is a string
          //console.log("dob is ", birthday)
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
          //console.log(birthdate);

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
    var next = parseInt(this.currentQ) + 1;
    //console.log(today)
    //console.log(this.currentQ)
    console.log(this.clinicIDNew, today, next);

    this._authService._getCheckInDetails(this.clinicIDNew, today, next)
      .subscribe(data => {
        console.log(data);
        if (data.$value && data.$value != null) {
          this._authService._setClinicQueue(this.clinicIDNew, today, next);
          this.router.navigate(['out-patients/' + data.$key + '/' + data.$value])

        }
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
  nextPatient() {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var today = dd + '-' + mm + '-' + yyyy;
    var next = parseInt(this.currentQ) + 1;
    //console.log(today)
    //console.log(this.currentQ)
    console.log(this.clinicIDNew, today, next);

    this._authService._getCheckInDetails(this.clinicIDNew, today, next)
      .subscribe(data => {
        console.log(data);
        if (data.$value && data.$value != null) {
          //this._authService._setClinicQueue(this.clinicIDNew, today, next);
          this.router.navigate(['out-patients/' + data.$key + '/' + data.$value])

        }
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
  previousPatient() {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var today = dd + '-' + mm + '-' + yyyy;
    var next = parseInt(this.currentQ) - 1;
    //console.log(today)
    //console.log(this.currentQ)
    console.log(this.clinicIDNew, today, next);

    this._authService._getCheckInDetails(this.clinicIDNew, today, next)
      .subscribe(data => {
        console.log(data);
        if (data.$value && data.$value != null) {
          //this._authService._setClinicQueue(this.clinicIDNew, today, next);
          this.router.navigate(['out-patients/' + data.$key + '/' + data.$value])

        }
        else {
          $.notify({
            icon: "notifications",
            message: "No previous patients"

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
