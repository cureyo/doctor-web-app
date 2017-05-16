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
  //for activity
  private activitySummarytitle:any;
  private activitySummaryDate:any;
  private activitySummaryTrimedtitle:any;
  private activitySummaryAverage:any;
//for Hr summary
  private hrSummarytitle:any;
  private hrSummaryDate:any;
  private hrSummaryTrimedtitle:any;
  private hrSummaryAverage:any;
  //for SleepSummary
  private sleepSummarytitle:any;
  private sleepSummaryDate:any;
  private sleepSummaryTrimedtitle:any;
  private sleepSummaryAverage:any;
  //for height
  private height:any; 
  private heightUnit:any;
  //for weight
  private weight:any; 
  private weightUnit:any;

 
  constructor(private _fb: FormBuilder, private _authService: AuthService, private route: ActivatedRoute, private router: Router, private http: Http) {


  }

  ngOnInit() {
      
     this.route.params.subscribe(
      params => {
        let param = params['id'];
        
        /*************************************************************************************************** */
          //preparing  the data from the firebase for chart 
      this.tempCurrentUserID=param;
      console.log("user and caredone ID:",this.tempCurrentUserID)
        this._authService._getPatientFitnessData(this.tempCurrentUserID)
        .subscribe(response=>{
           console.log("response is :",response);
            var activitySummaryObj=response.ActivitySummary;
            var hrSummaryObj=response.HRSummary;
            var sleepSummaryObj=response.SleepSummary;
            this.height=response.Height.value;
            this.heightUnit=response.Height.unit;
            this.weight=response.Weight.value;
            this.weightUnit=response.Weight.unit;
            this.activitySummaryChart(activitySummaryObj);
            var self = this;
            setTimeout(
              function() {
                self.HRSummarychart(hrSummaryObj);

                      setTimeout(
                    function() {
                      self.SleepSummaryChart(sleepSummaryObj);
                    }, 3000
                  )
              }, 2000
            )
            
           
             
        
       // end of chart.js function call
     })
       //end of chart data preparation
/*************************************************************************************************** */
          
    }); 
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

  } //end of ngOnInIt 
  //function for activity summary
  activitySummaryChart(activitySummaryObj){
    console.log("Activity summary Obj:",activitySummaryObj);
             var labelArr=[];
             var seriesArr=[];
             var minValue;
             var maxValue;
             var startDate;
             var endDate;
             var average;
             var series;
             var labels;
            //  temp=activitySummaryObj;
             this.activitySummaryTrimedtitle="ActivitySummary";
             this.activitySummaryTrimedtitle=this.activitySummaryTrimedtitle.slice(0,-7);
    
       for (var i=0;i<activitySummaryObj.length;i++){

                minValue=activitySummaryObj[0].calories;
                maxValue=activitySummaryObj[0].calories;
                startDate=activitySummaryObj[0].date;
                endDate=activitySummaryObj[activitySummaryObj.length-1].date;
                this.activitySummaryDate="from Date:"+" "+startDate+" "+"to Date:"+" "+endDate;
                series=activitySummaryObj[i].calories;
                labels=activitySummaryObj[i].date;
                //now trim the date 
                labels=labels.slice(-2);
                // console.log("trim date:",labels)
                //end of date triming 

                  seriesArr[i]=series;
                
                if (i==0 || i==activitySummaryObj.length-1)
                {
                  labelArr[i]=labels;
                }
                else 
                {
                    labelArr[i]=" ";
                }
              
                 labelArr[labelArr.length]="";
              
                //min value 
                if (minValue>series){
                    minValue=series;
                
                }
                //max value
                if (maxValue<series){
                  maxValue=series;
                  
                }
              
          }
            this.activitySummaryAverage=Math.round(parseInt(minValue+maxValue)/activitySummaryObj.length);
            var t=LineChart(labelArr,seriesArr,minValue,maxValue,"patientsomething");
            console.log("patientsomething id is", t)
            this.activitySummarytitle=t;
  }
//end of function for activity summary
//Hr summary chart
HRSummarychart(hrSummaryObj){
   console.log("hr summary Obj:",hrSummaryObj);

             var hrlabelArr=[];
             var hrseriesArr=[];
             var hrminValue;
             var hrmaxValue;
             var hrstartDate;
             var hrendDate;
             var hraverage=0;
             var hrseries=0;
             var hrlabels;
             var Datearray=[];
            //  temp=activitySummaryObj;
             this.hrSummaryTrimedtitle="hrSummary";
             this.hrSummaryTrimedtitle=this.hrSummaryTrimedtitle.slice(0,-7);

    
       for (var i=0;i<hrSummaryObj.length;i++){
                
                  //now trim the date
                var temp = new Date(hrSummaryObj[i].timestamp);
                Datearray[i]= temp.getFullYear()+'-' + (temp.getMonth()+1) + '-'+temp.getDate(); 
                //end of date trim 

                hrminValue=hrSummaryObj[0].value;
                hrmaxValue=hrSummaryObj[0].value;
                hrseries=hrSummaryObj[i].value;
                hrlabels=Datearray[i];
                //now trim the date 
                  hrlabels=hrlabels.slice(-2);
                // console.log("trim date:",hrlabels)
                //end of date triming 

                  hrseriesArr[i]=hrseries;
                
                if (i==0 || i==hrSummaryObj.length-1)
                {
                  hrlabelArr[i]=hrlabels;
                }
                else 
                {
                    hrlabelArr[i]=" ";
                }
              
                 hrlabelArr[hrlabelArr.length]="";
              
                //min value 
                if (hrminValue>hrseries){
                    hrminValue=hrseries;
                
                }
                //max value
                if (hrmaxValue<hrseries){
                  hrmaxValue=hrseries;
                  
                }
              
          }
                hrstartDate=Datearray[0];
                hrendDate=Datearray[Datearray.length-1];
                this.hrSummaryDate="from Date:"+" "+hrstartDate+" "+"to Date:"+" "+hrendDate;
                // console.log(".hrSummaryDate",this.hrSummaryDate);

                this.hrSummaryAverage=Math.round(parseInt(hrminValue+hrmaxValue)/hrSummaryObj.length);
                var t=LineChart(hrlabelArr,hrseriesArr,hrminValue,hrmaxValue,"HrSummary");
                console.log("id is", t)
                this.hrSummarytitle=t;
}
//end of hr summary chart
//sleep summary chart
SleepSummaryChart(sleepSummaryObj){

          console.log("sleep summary Obj:",sleepSummaryObj);

             var sleeplabelArr=[];
             var sleepseriesArr=[];
             var sleepminValue;
             var sleepmaxValue;
             var sleepstartDate;
             var sleependDate;
             var sleepaverage=0;
             var sleepseries=0;
             var sleeplabels;
            //  temp=activitySummaryObj;
             this.sleepSummaryTrimedtitle="sleepSummary";
             this.sleepSummaryTrimedtitle=this.sleepSummaryTrimedtitle.slice(0,-7);
    
       for (var i=0;i<sleepSummaryObj.length;i++){

                sleepminValue=sleepSummaryObj[0].timeAsleep;
                sleepmaxValue=sleepSummaryObj[0].timeAsleep;
                sleepstartDate=sleepSummaryObj[0].date;
                sleependDate=sleepSummaryObj[sleepSummaryObj.length-1].date;
                this.sleepSummaryDate="from Date:"+" "+sleepstartDate+" "+"to Date:"+" "+sleependDate;
                sleepseries=sleepSummaryObj[i].timeAsleep;
                sleeplabels=sleepSummaryObj[i].date;
                //now trim the date 
                 sleeplabels=sleeplabels.slice(-2);
                // console.log("trim date:",labels)
                //end of date triming 

                  sleepseriesArr[i]=sleepseries;
                
                if (i==0 || i==sleepSummaryObj.length-1)
                {
                  sleeplabelArr[i]=sleeplabels;
                }
                else 
                {
                    sleeplabelArr[i]=" ";
                }
              
                 sleeplabelArr[sleeplabelArr.length]="";
              
                //min value 
                if (sleepminValue>sleepseries){
                    sleepminValue=sleepseries;
                
                }
                //max value
                if (sleepmaxValue<sleepseries){
                  sleepmaxValue=sleepseries;
                  
                }
              
          }
            this.sleepSummaryAverage=Math.round(parseInt(sleepminValue+sleepmaxValue)/sleepSummaryObj.length);
            var t=LineChart(sleeplabelArr,sleepseriesArr,sleepminValue,sleepmaxValue,"sleepSummary");
            console.log("id is", t)
            this.sleepSummarytitle=t;

}
//end of sleep summary chart

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
        
        let ctrNormal = 0, ctrOther = 0, ctrDeviations = 0;
        this.hasOtherHistory = [];
        this.hasNormalHistory = [];
        this.hasDeviationsHistory = [];

        for (let item in data) {
          console.log(data[item]);
          if (item != "$key" && item != "$exists") {
            console.log(data[item]);
            if (data[item].standard != false && data[item].standard != true && data[item].response == "") {
              console.log("no response")
            }
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
