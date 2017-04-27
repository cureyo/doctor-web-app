import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../../config/app.config';
import initDemo = require('../../../assets/js/charts.js');
import { BloodSugarChartComponent } from "./BloodSugarChart/BloodSugarChart.component";

declare var $: any

@Component({
  selector: 'weeklyreports-cmp',
  moduleId: module.id,
  templateUrl: 'weeklyreports.component.html',
})

export class WeeklyReportComponent implements OnInit, AfterViewInit {
  private medReminder: any = 'Medication Reminder';
  private labTest: any = 'Lab Test';
  private  exerciseTracker: any = 'Exercise Tracker';
  private bloodPressure:any='Blood Pressure';
  private physicalConsult:any='Physical_Consultation';
  private bloodSugar:any='Blood Sugar';

  // private exerciseTracker: any = 'Medication Reminder';
  // private medReminder: any = 'Medication Reminder';
  // private medReminder: any = 'Medication Reminder';
  // private medReminder: any = 'Medication Reminder';
  // private medReminder: any = 'Medication Reminder';
  private currentUser: any;
  private showModal: boolean = false;
  private user: any;
  private isAuth: boolean;
  private caredOneID: any;
  private noCaredOnes: boolean = false;
  private fbAccessToken: string;
  private caredOnes: {};
  private onboardingReview: any;
  private schedJobType: any;
  private noOfCaredOnes: number = 0;
  private noOfCaredBy: number = 0;
  private fbFriends: any;
  private fbFamily: any;
  private famCount: number = 0;
  private caredonesToAdd: any;
  private scheduledJobs: any;
  private defaultData: any;
  private caredOnesFamily: any;
  private exerciseTitles: any;
  private exerciseValues: any;
  private medicineTitles: any;
  private medicineValues: any;
  private medicineData: any;
  private caredone: any;
  private exMax: any;
  private exerStartDate: any;
  private exerEndDate: any;
  private averageEx: any;
  private bsStartDate: any;
  private bsEndDate: any;
  private bsTitles: any;
  private bsValues: any;
  private bsMax: any;
  private bpStartDate: any;
  private bpEndDate: any;
  private bpTitles: any;
  private bpValuesSys: any;
  private bpValuesDias: any;
  private bpMax: any;
  private averageBpSys: any;
  private averageBpDias: any;
  private averageBS: any;
  private averageMed: any;
  private consultDate: any;
  private potentialRisks: any;
  private riskCount: any;
  private labTestDate: any;
  private labSeries: any;
  private labTitles: any;
  private labTestCount: any;
  private dataReady: boolean = false;
  private CaredoneJobs:any;



  constructor(

    private _authService: AuthService,
    private fs: FacebookService,
    private router: Router,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
    this.averageBS = "65";


  }//  constructor

  ngOnInit() {

  }

  ngAfterViewInit() {
    let unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV;
    //console.log("this happened");
    this._authService._getUser()
      .subscribe(
      data => {
        //this.currentUserID = data.user.uid;
        this.currentUser = this._authService._getCurrentUser();
        console.log(this.currentUser);
        this.getData();
      });

    //initDemo(this.labTitles, this.labSeries, this.exerciseTitles, this.exerciseValues, this.exMax, this.medicineTitles, this.medicineValues, this.bsTitles, this.bsValues, this.bsMax, this.bpTitles, this.bpValuesSys, this.bpValuesDias, this.bpMax, unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV);
  }

  getData() {
    // let unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV;
    // initDemo(this.labTitles, this.labSeries,this.exerciseTitles, this.exerciseValues, this.exMax, this.medicineTitles, this.medicineValues, this.bsTitles, this.bsValues, this.bsMax, this.bpTitles, this.bpValuesSys, this.bpValuesDias, this.bpMax, unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV);
    this.dataReady = false;
    this.averageBS = "95";
    this.exerciseTitles = this.exerciseValues = this.medicineTitles = this.medicineValues = this.medicineData = this.exMax = this.exerStartDate = this.exerEndDate = this.averageEx = this.bsStartDate = this.bsEndDate = this.bsTitles = this.bsValues = this.bsMax = this.bpStartDate = this.bpEndDate = this.bpTitles = this.bpValuesSys = this.bpValuesDias = this.bpMax = this.averageBpSys = this.averageBpDias = this.averageBS = this.averageMed = this.consultDate = this.potentialRisks = this.riskCount = this.labTestDate = this.labSeries = this.labTitles = this.labTestCount = null;

    this.route.params.subscribe(
      params => {
        let param = params['id'];
        this.caredOneID = param;
        //console.log("this happened");
        this.currentUser = this._authService._getCurrentUser();
        if (this.currentUser == false) {
          this._authService._getUser()
            .subscribe(
            data => {
              if (!data.isAuth) {
                 //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
              }
              else {
                this._authService._fetchUser(data.user.uid)
                  .subscribe(res => {
                    console.log(res);
                    if (res) {
                      this.currentUser = this._authService._getCurrentUser();
                      this.initiate(param);

                    } else {
                      console.log("redirecting to checkup");


                      this.router.navigate(['doctor-checkup'])

                    }
                  });
              }
            });
        } else {
          this.initiate(param);
        }

      });



  }
  initiate(param) {
    console.log(this.currentUser)
    this._authService._findCaredOne(this.currentUser.authUID, param)
      .subscribe(
      data => {
        this.caredone = data;
        console.log(" caredone data", this.caredone);
      }
      )
    this.getMedData(param);

    this.getExData(param);

    this.getBSData(param);

    this.getBPData(param);

    this.getConsultData(param);

    this.getLabTestData(param);

    this.dataReady = true;

    let unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV;
    initDemo(this.labTitles, this.labSeries, this.exerciseTitles, this.exerciseValues, this.exMax, this.medicineTitles, this.medicineValues, this.bsTitles, this.bsValues, this.bsMax, this.bpTitles, this.bpValuesSys, this.bpValuesDias, this.bpMax, unPara1, unPara1CV, unPara1TV, unPara2, unPara2CV, unPara2TV, unPara3, unPara3CV, unPara3TV);

  }

  getBSData = (param) => {
    this.bsStartDate = null;
    this.bsEndDate = null;
    this.bsTitles = null;
    this.bsValues = null;
    this.bsMax = null;
    this.averageBS = null;
    this._authService._BloodSugarData(param).subscribe(
      bloodSugar => {
        //Update Blood Sugar data
        console.log(bloodSugar[0]);
        if (bloodSugar[0]) {
          //console.log(bloodSugar[0]);
          let endIndex = bloodSugar.length - 1, startIndex, exLabels = [], exSeries = [];
          var exDay, i = 0, totalEx = 0, ctr = 0;
          var maxEx = 0, aveEx = 0, dailyEx = 0;
          if (endIndex > 7) {
            startIndex = endIndex - 7;
          } else {
            startIndex = 0;
          }
          for (i = startIndex; i < endIndex; i++) {
            exDay = bloodSugar[startIndex + ctr].Title;
            exLabels[ctr] = exDay.substring(0, 2);
            exSeries[ctr] = bloodSugar[startIndex + ctr].Sugar_Value;
            //console.log(totalEx);
            totalEx = totalEx + parseFloat(exSeries[ctr]);

            if (maxEx < exSeries[ctr]) {
              maxEx = exSeries[ctr];
            }
            ctr = ctr + 1;
          }
          console.log(exLabels);
          console.log(exSeries)
          aveEx = totalEx / ctr;

          this.averageBS = aveEx.toFixed(2);
          console.log("this.averageBS");
          console.log(this.averageBS);
          this.bsStartDate = bloodSugar[startIndex].Title;
          this.bsEndDate = bloodSugar[endIndex].Title;
          this.bsTitles = exLabels;
          this.bsValues = exSeries;
          this.bsMax = maxEx;


        }
        else {
          this.bsStartDate = null;
          this.bsEndDate = null;
          this.bsTitles = null;
          this.bsValues = null;
          this.bsMax = null;
          this.averageBS = null;
        }
      });
  }

  getBPData = (param) => {
    this.bpStartDate = null;
    this.bpEndDate = null;
    this.bpTitles = null;
    this.bpValuesSys = null;
    this.bpValuesDias = null;
    this.bpMax = null;
    this.averageBpSys = null;
    this._authService._BloodPressureData(param).subscribe(
      bloodPressure => {
        //Update Blood Pressure data
        if (bloodPressure[0]) {
          let endIndex = bloodPressure.length - 1, startIndex, exLabels = [], exSeries = [], exSeries2 = [];
          var exDay, i = 0, totalBPSys = 0, totalBPDias = 0, ctr = 0;
          var maxEx = 0, aveBPsys = 0, aveBPdias = 0, dailyEx = 0;
          if (endIndex > 7) {
            startIndex = endIndex - 7;
          } else {
            startIndex = 0;
          }
          for (i = startIndex; i < endIndex; i++) {
            exDay = bloodPressure[startIndex + ctr].Title;
            exLabels[ctr] = exDay.substring(0, 2);
            exSeries[ctr] = bloodPressure[startIndex + ctr].Value_Systolic;
            exSeries2[ctr] = bloodPressure[startIndex + ctr].Value_Diastolic;
            //console.log(totalEx);
            totalBPSys = totalBPSys + parseFloat(exSeries[ctr]);
            totalBPDias = totalBPDias + parseFloat(exSeries2[ctr]);

            if (maxEx < exSeries[ctr]) {
              maxEx = exSeries[ctr];
            }
            ctr = ctr + 1;
          }
          //console.log("exerMax is ", maxEx);
          //console.log("total is ", totalEx)
          aveBPsys = totalBPSys / ctr;
          aveBPdias = totalBPDias / ctr;
          this.averageBpSys = aveBPsys.toFixed(2);
          this.averageBpDias = aveBPdias.toFixed(2);

          this.bpStartDate = bloodPressure[startIndex].Title;
          this.bpEndDate = bloodPressure[endIndex].Title;
          this.bpTitles = exLabels;
          this.bpValuesSys = exSeries;
          this.bpValuesDias = exSeries2;
          this.bpMax = maxEx;
          console.log("this.bpTitles");
          console.log(this.bpTitles);
          console.log(this.bpValuesSys);
        }
        else {
          this.bpStartDate = null;
          this.bpEndDate = null;
          this.bpTitles = null;
          this.bpValuesSys = null;
          this.bpValuesDias = null;
          this.bpMax = null;
          this.averageBpSys = null;
        }
      });

  }

  getConsultData = (param) => {
    this.consultDate = null;
    this.potentialRisks = null;
    this.riskCount = null;

    this._authService._getConsultations(param).subscribe(
      consultations => {
        console.log(consultations[0]);
        let consultLen = consultations.length;

        if (consultations[consultLen - 1]) {
          this.consultDate = consultations[consultLen - 1].Date;
          this.potentialRisks = consultations[consultLen - 1].PotentialRisks;
          this.riskCount = consultations[consultLen - 1].PotentialRisks.length;
        }
      });
  }

  getLabTestData = (param) => {
    this.labSeries = null;
    this.labTitles = null;
    this.labTestDate = null;
    this.labTestCount = null;
    this._authService._getLabTests(param).subscribe(
      labTests => {
        console.log(labTests[0]);
        let consultLen = labTests.length, lbSeries = [], lbTitles = [], ctr = 0;

        if (labTests[consultLen - 1]) {
          this.labTestDate = labTests[consultLen - 1].Date;

          this.labTestCount = labTests[consultLen - 1].UnhealthyParameter.length;

          for (let test of labTests[consultLen - 1].UnhealthyParameter) {
            console.log(test);
            lbSeries[ctr] = test.CurrentVal;
            lbTitles[ctr] = test.Name;
            ctr = ctr + 1;

          }
          this.labSeries = lbSeries;
          this.labTitles = lbTitles;
          console.log("this.labSeries");
          console.log(this.labSeries);
          console.log(this.labTitles);
        }
      });
  }

  getExData = (param) => {
    this.exerStartDate = null;
    this.exerEndDate = null;
    this.exerciseTitles = null;
    this.exerciseValues = null;
    this.exMax = null;
    this.averageEx = null;
    this._authService._getExerciseData(param).subscribe(
      exer => {
        //Update Exercise data
        //console.log(exer[0]);
        if (exer[0]) {
          let endIndex = exer.length - 1, startIndex, exLabels = [], exSeries = [];
          var exDay, i = 0, totalEx = 0, ctr = 0;
          var maxEx = 0, aveEx = 0, dailyEx = 0;
          if (endIndex > 7) {
            startIndex = endIndex - 7;
          } else {
            startIndex = 0;
          }
          for (i = startIndex; i < endIndex; i++) {
            if (exer[startIndex + ctr]) {
              //console.log("exer[startIndex + ctr]")
              //console.log(exer[startIndex + ctr]);
              exDay = exer[startIndex + ctr].Title;
              exLabels[ctr] = exDay.substring(0, 2);

              exSeries[ctr] = exer[startIndex + ctr].Value;
              //console.log(totalEx);
              totalEx = totalEx + parseFloat(exSeries[ctr]);

              if (maxEx < exSeries[ctr]) {
                maxEx = exSeries[ctr];
              }
              ctr = ctr + 1;
            }

          }
          //console.log("exerMax is ", maxEx);
          //console.log("total is ", totalEx)
          aveEx = totalEx / ctr;
          this.averageEx = aveEx.toFixed(2);

          this.exerStartDate = exer[startIndex].Title;
          this.exerEndDate = exer[endIndex].Title;
          this.exerciseTitles = exLabels;
          this.exerciseValues = exSeries;
          this.exMax = maxEx;
        }

      });
  }

  getMedData = (param) => {
    this.medicineTitles = null;
    this.medicineValues = null;
    this.averageMed = null;
    this._authService._getMedicationReminders(param).subscribe(
      meds => {

        //console.log("this 2 happened");
        //Update Medicine data
        //console.log(meds[0]);
        if (meds[0]) {
          let exMLabels = [], exMSeries = [], index = 0;
          for (let med of meds) {
            exMLabels[index] = med.$key;
            //console.log("med");
            //console.log(med);
            ////console.log(meds[med]);
            if (med.Tracking_Data && med.$key != ",") {
              let endMIndex = med.Tracking_Data.length - 1, startMIndex;
              var medDay, i = 0, totalMed = 0, ctr = 0;
              var maxMed = 0, aveMed = [], dailyMed = 0, avMed = 0;
              if (endMIndex > 7) {
                startMIndex = endMIndex - 7;
              } else {
                startMIndex = 0;
              }
              for (i = startMIndex; i < endMIndex; i++) {
                if (med.Tracking_Data[startMIndex + ctr].Value == 1) {
                  totalMed = totalMed + 1;
                }


                console.log(totalMed);

                ctr = ctr + 1;
              }
              console.log("exerMax is ", maxMed);
              console.log("total is ", totalMed)
              // aveEx = totalEx/ ctr;
              aveMed[index] = 100 * totalMed / ctr;

              exMSeries[index] = aveMed[index].toFixed(2);
              if (isNaN(exMSeries[index])) {
                exMSeries[index] = "0.00";
              }
       
            }
            this.medicineTitles = exMLabels;
            this.medicineValues = exMSeries;
            let mCount = 0, aveMedicines = 0;
            for (let med in exMSeries) {
            //  console.log(exMSeries[med]);
              mCount = mCount + 1;
              aveMedicines = aveMedicines + parseInt(exMSeries[med]);
             // console.log(aveMedicines);

            }

          }
          this.medicineTitles = exMLabels;
          this.medicineValues = exMSeries;
          let mCount = 0, aveMedicines = 0;
          console.log(exMSeries);
          for (let med in exMSeries) {
            console.log(exMSeries[med]);
            mCount = mCount + 1;
            aveMedicines = aveMedicines + parseInt(exMSeries[med]);
            console.log(aveMedicines);
          }
          this.averageMed = aveMedicines / mCount;

        };

      });
  }

showJobs (jobType) {
  this.schedJobType = jobType;
    //  if (this.schedJobType)
    //     this.showModal = true;
  console.log("Showing details for :", this.schedJobType);
  $('#reportModal').modal('show');
  $('#reportContent').css({ position: "fixed" });

}

public refreshModal() {
  this.schedJobType = null;
}
}// DashboardComponent
