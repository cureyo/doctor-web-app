import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { AppConfig } from '../../config/app.config';
import initDemo = require('../../../assets/js/charts.js');
import { CaredoneFormComponent } from "../caredone-form/caredone-form.component";
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import LineChart=require('../../../assets/js/linechart.js');
import BarChart=require('../../../assets/js/barchart.js');

declare var $: any

@Component({
  selector: 'home-cmp',
  moduleId: module.id,
  templateUrl: 'home.component.html',
  providers: [CacheService]
})

export class HomeComponent implements OnInit, AfterViewInit {

  private currentUser: any;
  private user: any;
  private isAuth: boolean;
  private noCaredOnes: boolean = false;
  private fbAccessToken: string;
  private totalCheckIns: any = 0;
  private caredOnes: any = [];
  private caredOnesCopy: any = [];
  private checkInsTblDates: any = [];
  private checkInsTblCount: any = [];
  private onboardingReview: any;
  private noOfCaredOnes: number = 0;
  private noOfCaredBy: number = 0;
  public fbFriends: any;
  public friends4Cache: any;
  private fbFamily: any;
  private famCount: number = 0;
  private caredonesToAdd: any;
  private scheduledJobs: any;
  private defaultData: any;
  private caredOnesFamily: any =[];
  private caredOneId: any;
  private noFacebook: boolean = true;
  private tempCurrentUserID:any;
  private totalMsngrConnects: any;
  private totalCaresScheduled: any;
  private checkInChartId: any = "checkInChart";
  private ovlSummaryChartId: any = "ovlSummaryChartId";
  private checkInChrtReady: boolean = false;
  private ovlSummaryChrtReady: boolean = false;
  private averageCheckIns: any;
  private checkInsSummaryTitle: any = "Patient Check-ins";
  private checkInsSummaryText: any = "In the last week";
  private ovlSummaryTitle: any = "Patient Funnel";
  private ovlSummaryText: any = "Other statistics";

  ngAfterViewInit(): void {
    // $('html,body').animate({ scrollTop: $("#header").offset().top - 200 }, 500);
    $('#myModal').modal('hide');
     $('#mainContent').css({ position: "" });

  }

  constructor(

    private _authService: AuthService,
    private fs: FacebookService,
    private router: Router,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private _cacheService: CacheService
  ) {


  }//  constructor

  public showModal(modalId, caredId) {
    //console.log("show modal for: ", modalId)
    this.caredOneId = caredId;

    $('#myModal').modal('show');

    window.scroll(0, -100);
    //console.log($('#mainContent'));
    $('#mainContent').css({ position: 'fixed' });
  }

  addDetails(id) {

    $('#myModal').modal('hide');
    $('#mainContent').css({ position: "" });
    //console.log("redirecting to ", "patient-preview/" + id)
    this.router.navigate(['patient-preview/', id])
  }

  gotoAdd() {

    var elmnt = document.getElementById('AddSection');
    elmnt.scrollIntoView();
  }


  closeModal() {

    $('#myModal').modal('hide');
    $('#mainContent').css({ position: "" });

  }

  getcurrentUser(uid) {
    this._authService._fetchUser(uid)
      .subscribe(res => {
        //console.log("from fetch user");
        //console.log(res);
        if (res) {
          this.currentUser = this._authService._getCurrentUser();

          this.getCaredones();
          this.getClinicSummary(this.currentUser.clinicWebsite, this.currentUser.fbPageId, this.currentUser.fbPageAdded)


        } else {
          this.router.navigate(['doctor-checkup']);
          //console.log("doctor-checkup needed");
        }
      });
  }//  getcurrentUser()

  ngOnInit() {
    $('#myModal').modal('hide');
   
    this._authService._getUser()
      .subscribe(
      data => {
       
        if (!data.isAuth) {
         //window.location.href = window.location.origin + '/login?next=' + window.location.pathname;
        }
        else {
          this.isAuth = data.isAuth;
          //console.log("We are home now");
          this.getcurrentUser(data.user.uid);

           

        }

      },
      error => console.log(error)
      );

     
  }


  getCaredones() {
    this.caredOnesFamily[0] = { id: "phoneNumber", relationship: "", name: "Using Email/ Phone", imageURL: "/assets/img/man.png", directAdd: "mail" };
    this._authService._getcaredOnesList(this.currentUser.authUID).subscribe(
      data => {
        //////console.log(data);
        for (let i = 0; i < data.length; i++) {
          //data[i]['checkToAdd'] = this.currentUser.checkToAdd;
          this._authService._getMedicationReminders(data[i].uid).subscribe(
            meds => {
              data[i]['hasMedReminder'] = meds.length > 0;
              this._authService._getExerciseData(data[i].uid).subscribe(
                exer => {
                  data[i]['input'] = this.prepareScore(meds, exer);
                  data[i]['total'] = this.prepareTotal(meds, exer);
                  data[i]['perf'] = this.preparePerf(meds, exer);
                  this._authService._getCaredOneInsight(data[i].uid).subscribe(
                    insight => {
                      //////console.log(insight);
                      if (insight[0]) {
                        data[i]['insights'] = insight;
                        //////console.log("insights added");
                      } else {
                        data[i]['insights'] = null;
                      }

                    }
                  )

                }); // _getExerciseData

            }); // _getMedicationReminders


        }//  for loop
        this.caredOnes = data;
        this.caredOnesCopy = data;

        if (data.length == 0) {
          this.noCaredOnes = true;

        }
        else { this.noCaredOnes = false; }
      }//  data

    ); // _getcaredOnesList

  }//  getCaredones

  prepareScore = (meds, exercise) => {

    if (meds === null && meds.length === 0 && exercise.hasOwnProperty('Tracker') && exercise.Tracker.length === 0) {
      return null;
    }

    let ctr = 0, gt = 0, target, count,
      avgResponse = 0,
      sumOfMed = 0,
      sumOfExer = 0,
      countOfItems = 0
      ;
    if (meds.length > 0) {
      for (let med of meds) {

        if (med.Tracking_Data) {

          count = 0;
          for (let val of med['Tracking_Data']) {
            if (val) {
              if (val.Value === 1) {
                count++;
              }
            }

          }//  loop

          avgResponse = parseFloat(((count / med['Tracking_Data'].length) * 100).toFixed(0));
          sumOfMed += avgResponse;

        }//  has Tracking_Data
        countOfItems = countOfItems + 1;
      }//  loop
    } else {
      sumOfMed = 0;
    }
    if (exercise.Tracker && exercise.Tracker.length > 0) {
      target = exercise.Details.Daily_Target;
      countOfItems = countOfItems + 1;

      for (let ex of exercise.Tracker) {

        if (ex != null && ex.hasOwnProperty('Value')) {

          if (ex.Value > target) {
            gt++;
          }
          ctr++;
        }
      }//  for loop

      sumOfExer = parseFloat((gt / ctr * 100).toFixed(0));
    } else {
      sumOfExer = 0;
    }

    if (countOfItems === 0) {
      countOfItems = 1;
    }
    return ((sumOfMed + sumOfExer) / countOfItems).toFixed(0);

  }//  prepareScore

  preparePerf = (meds, exercise) => {

    if (meds === null && meds.length === 0 && exercise.Tracker.length === 0) {
      return null;
    }
    let ctr = 0, gt = 0, target, count,
      avgResponse = 0,
      sumOfExer = 0,
      countOfItems = 0,
      countOfPerfs = 0
      ;
    if (meds.length > 0) {
      for (let med of meds) {

        if (med.hasOwnProperty('Tracking_Data')) {

          count = 0;
          for (let val of med['Tracking_Data']) {
            if (val) {
              if (val.Value === 1) {
                count++;
              }
            }
          }//  loop


          avgResponse = parseFloat(((count / med['Tracking_Data'].length) * 100).toFixed(0));
          if (avgResponse === 100) {
            countOfPerfs = countOfPerfs + 1;
          }


        }// has Tracking_Data
        countOfItems = countOfItems + 1;
      }// loop
    }
    if (exercise.Tracker && exercise.Tracker.length > 0) {
      target = exercise.Details.Daily_Target;
      countOfItems = countOfItems + 1;

      for (let ex of exercise.Tracker) {

        if (ex != null && ex.hasOwnProperty('Value')) {

          if (ex.Value > target) {
            gt++;
          }
          ctr++;
        }
      }// for loop

      sumOfExer = parseFloat((gt / ctr * 100).toFixed(0));
      if (sumOfExer === 100) {
        countOfPerfs = countOfPerfs + 1;
      }
    }

    return countOfPerfs;

  }// preparePerf

  prepareTotal = (meds, exercise) => {

    if (meds === null && meds.length === 0 && exercise.Tracker.length === 0)
      return null;

    let countOfItems = 0;
    if (meds.length > 0) {
      countOfItems = meds.length;
    }
    if (exercise.Tracker && exercise.Tracker.length > 0) {
      countOfItems = countOfItems + 1;
    }

    return countOfItems;

  }// prepareTotal

  showCaredoneForm(event, member) {
    //////console.log("cared one being added");

    let target = event.target || event.srcElement || event.currentTarget;
    //////console.log(target);

    this.deactivateAllACO(target);

    let cor = $(target).parent(),
      details = cor.next('.card-content2');
    //////console.log(cor);
    //////console.log(details);

    cor.addClass('hide');
    cor.parent().addClass('active');

    details.removeClass('hide');
  }

  filterFriends(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let term = $(target).val().trim();
    console.log(event);
    if (term.length >= 2) {
      this.caredOnes = this.caredOnes.filter((item) => {
        return item.firstName.toLowerCase().indexOf(term.toLowerCase()) > -1;
      });
    } else {
      this.caredOnes = this.caredOnesCopy;
    }

  }//filterFriends()

  deactivateAllACO(target) {

    $(target).closest('.col-md-4').siblings().each(function (e, k) {
      //////console.log("closest called");
      $(k).removeClass('active');
      $(k).find('.cor').removeClass('hide');
      let details = $(k).find('.card-content2');
      //////console.log(details);
      details.addClass('hide');
      details.find('.fields').empty();
      let footer = $(k).find('.card-footer');
      //////console.log(footer);
      footer.removeClass('hide');
    });
  }
getClinicSummary(clinicIdFull, pageId, pagePresent) {
  let n = clinicIdFull.indexOf('.'), minValue1, maxValue1;
  if (n == -1) {
    n = clinicIdFull.length;
  }
  let clinicId = clinicIdFull.substring(0, n);
  this._authService._getAllCheckIns(clinicId)
  .subscribe(
    checkIns => {
      console.log(checkIns);
      let ctr = 0, cnt = 0, strt = 0, tempArr = [];
      
      
     
      console.log(checkIns)
      for (let item in checkIns) {
        if (item != '$exists' && item != '$key' && item != 'length' ) {
        
        
        
        
          this.checkInsTblDates[ctr] = item.substring(0,5)
          if (checkIns[item].length)
          this.checkInsTblCount[ctr] = checkIns[item].length;
          else 
          this.checkInsTblCount[ctr] = 0;
          this.totalCheckIns = parseInt(this.totalCheckIns) + this.checkInsTblCount[ctr];
          ctr++;
          if ( this.checkInsTblCount[ctr] > maxValue1) {
            maxValue1 = this.checkInsTblCount[ctr]
          } 
          if (this.checkInsTblCount[ctr] < minValue1) {
            minValue1 = this.checkInsTblCount[ctr]
          }
        cnt++;
          
        }
      }
       console.log(this.checkInsTblDates);
      console.log(this.checkInsTblCount);
      //Keep only information for last week
      if (cnt > 7) {
        this.checkInsTblCount.splice(0, cnt -7);
        this.checkInsTblDates.splice(0, cnt -7)
      }
      var sum = this.checkInsTblCount.reduce(function(a, b) { return a + b; }, 0);
      if (cnt > 7)
      this.averageCheckIns = sum/7;
      else 
      this.averageCheckIns = sum/cnt;

      this.averageCheckIns = this.averageCheckIns.toFixed(1);

      console.log(this.checkInsTblDates);
      console.log(this.checkInsTblCount);
      console.log(this.totalCheckIns);
      if (pagePresent) {
        this._authService._getMessengerIds(pageId)
        .subscribe(
          msngrData => {
            this.totalMsngrConnects = msngrData.length;
            this._authService._getCareSchedules(pageId)
            .subscribe(
              csData => {
                this.totalCaresScheduled = csData.length;
                console.log(this.totalCaresScheduled);
                console.log(this.totalMsngrConnects);
                 this.checkInChrtReady = true;
                 this.ovlSummaryChrtReady = true;
                  var self = this;
                  setTimeout(
                    function() {
                      
                      var t = LineChart(self.checkInsTblDates,self.checkInsTblCount,minValue1,maxValue1,self.checkInChartId);
                  console.log("checkInChartId :", t);
                  setTimeout(
                    function() {
                      var ctLabels = ["Total Check-Ins", "Messenger Connects", "Care Plans Scheduled"]
                      var ctSeries = [self.totalCheckIns, self.totalMsngrConnects, self.totalCaresScheduled]
                      var t = BarChart(ctLabels,ctSeries,self.totalCheckIns,self.ovlSummaryChartId);
                  console.log("checkInChartId :", t);
                    }, 2000
                  )
                       
                    }, 2000
                  )
              }
            )
          }
        )
      }

    }
  )
}
}// DashboardComponent
