import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { FbService } from "../../services/facebook.service";
import { AppConfig } from '../../config/app.config';
import {LabTestJobsComponent} from "./lab-test-jobs/lab-test-jobs.component";
import {MedicationReminderJobsComponent} from "./medication-reminder-jobs/medication-reminder-jobs.component";
import initDemo = require('../../../assets/js/charts.js');
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';


@Component({
  selector: 'app-jobs-master',
  templateUrl: './jobs-master.component.html',
  styleUrls: ['./jobs-master.component.css'],
  providers: [CacheService]
})
export class JobsMasterComponent implements OnInit {
private noOfCaredOnes: number = 0;
  private noOfCaredBy: number = 0;
  private user: any;
  private hasCaredone: boolean = true;
  public caredoneUID: string;
  private caredone: any;
  private currentUser: any;
  private currentUserID: any;
  private isAuth: boolean;
  private noresult: boolean = false;
  public timeInterval: any;
  public dateInterval: any;
  public showDay: boolean = false;
  public showDate: boolean = false;
  private itemAdded: boolean = false;
  private itemAdded1: boolean = false;
  private itemAdded2: boolean = false;
  private allItemsAdded: boolean = false;
  private fbAccessToken: string = null;
  private reminderKey: string = 'TestJbK_';
  public caredonesDoctor: any;
  // private address: Object = null;
  // private pctDrName: string = '';
  private pctBbookingLink: string = null;
  private onboardingReview: any;
  private dataReady: boolean = false;
  private TestDetails:any;
  private MedNames:any;
  private TestNames: any;


  constructor(
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,

    private http: Http,
    private _cacheService: CacheService

  ) {

    this.timeInterval = [];
    this.dateInterval = [];
    this.setIntervals();

  } // constructor
  ngOnInit() {
    this._authService._getUser()
      .subscribe(
      data => {
         //console.log("the data is ",data);
         this.currentUser=data.user;
         //console.log("current user data is ",this.currentUser);
        this.currentUserID = data.user.uid;
        //console.log("current user id:",this.currentUserID);
        this.findCaredOne(this.currentUserID);


      });
  }// ngoninti
   getPathologicalTests(){
         this._authService._getPathologicalTests()
        .subscribe( data=>{
           //console.log("patholodical test details data :",data);
               this.TestNames=data;

               this._cacheService.set('testNames', { 'data': this.TestNames }, { expires: Date.now() + 1000 * 60 * 60 });

                //console.log("the med names is :",this.TestNames);
        })    
   } //getpathologicalTests
   getMedicines(){
         this._authService._getMedicineNames()
        .subscribe( data=>{
           //console.log("patholodical test details data :",data);
               this.MedNames=data;
                this._cacheService.set('medNames', { 'data': this.MedNames }, { expires: Date.now() + 1000 * 60 * 60 });


                //console.log("the med names is :",this.MedNames);
        })    
   } //getpathologicalTests
   findCaredOne(currentUserID)
  {
     this.route.params.subscribe(
      params => {
        let param = params['id'];
        //console.log("caredoneKey", param);
        this._authService._findCaredOne(currentUserID, param)
          .subscribe(
          data => {
            this.caredone = data;
            //console.log("caredone data:",this.caredone);
          })

      });
        let testData = this._cacheService.get('testNames');
        let medData = this._cacheService.get('medNames');
          

          if (testData != null) { 
            this.TestNames = testData.data;
          }
          else {
            this.getPathologicalTests();
          }

          if (medData != null) { 
            this.MedNames = medData.data;
          }
          else {
            this.getMedicines();
          }
        
        

  }//findcaredOne
    
  switchDay = (event) => {
    let target = event.target || event.srcElement || event.currentTarget,
      mode = $(target).val(),
      medDays = $(target).parent().nextAll('.med_days:first'),
      medDate = $(target).parent().nextAll('.med_dates:first');

    if (mode == 'daily') {
      medDate.addClass('hide');
      medDays.addClass('hide');
      this.showDay = false;
      this.showDate = false;
    } else {
      if (mode == 'weekly') {
        medDays.removeClass('hide');
        medDate.addClass('hide');
        this.showDay = true;
        this.showDate = false;
      } else {
        medDays.addClass('hide');
        medDate.removeClass('hide');
        this.showDay = false;
        this.showDate = true;
      }
    }//else

  }//switchDay()
 

  //set time interval for medicine timings
  setIntervals = () => {
    let hrs, md;

    for (let i = 5; i < 24; i++) {
      if (i == 12) {
        hrs = i;
      } else {
        hrs = i % 12;
      }
      if (hrs < 10) {
        hrs = "0" + hrs;
      }

      md = (i >= 12) ? ' PM' : ' AM';
      this.timeInterval.push(hrs + ":00" + md);
      this.timeInterval.push(hrs + ":30" + md);
    }

    for (let i = 1; i <= 31; i++) {
      this.dateInterval.push(i);
    }

  }//setTimeInterval
  


}
