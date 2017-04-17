import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MedReminder } from "../../models/medReminder.interface";
import { FbService } from "../../services/facebook.service";
import { AppConfig } from '../../config/app.config';
import { MedicationReminderComponent } from "./MedicationReminder/medication-Reminder.component";
import { ExerciseTrackerComponent } from "./ExerciseTracker/Exercise-Tracker.component";
import { BloodSugarTrackerComponent } from "./BloodSugarTracker/Blood-Sugar-Tracker.component";
import { SuggestedMedReminderComponent } from "./SuggestedMedReminder/Suggested-Med-Reminder.component";
import { OnlineConsultationComponent } from "./OnlineConsultation/Online-Consultation.component";
import { PhysicalConsultationComponent } from "./PhysicalConsultation/Physical-Consultation.component";
import initDemo = require('../../../assets/js/charts.js');
declare var $: any;

@Component({
  selector: 'table-cmp',
  moduleId: module.id,
  templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit {
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
  private address: Object = null;
  private pctDrName: string = '';
  private pctBbookingLink: string = null;
  private onboardingReview: any;
  private caredOneId: any;
  private dataReady: boolean = false;
  private dataNow: boolean = false;
  private testArray: any = [];
  private labArray: any = [];
  private labArray2: any = [];
  private labTotal: any = [];
  private vendorSelected: boolean = false;
  private bookOrder: FormGroup;
  private caredOneModel: any;
  private vData: any;
  private showErrorFlag: boolean = false;

  constructor(
    //private _fs: FbService, here is the error 
    private route: ActivatedRoute,
    private _authService: AuthService,
    private router: Router,
    private http: Http,
    private _fb: FormBuilder
  ) {




    this.timeInterval = [];
    this.dateInterval = [];

    this.setIntervals();



  } // constructor
  ngOnInit() {
    this._authService._getUser()
      .subscribe(
      data => {

        this.currentUserID = data.user.uid;
        this._authService._fetchUser(this.currentUserID)
          .subscribe(res => {
            this.currentUser = res;
            console.log(this.currentUser);
            this.fetchOnboardingReview();
          });
      });



  }
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
  getCaredoneDoctor = () => {

    this._authService._findCaredonesDoctor(this.onboardingReview.Doctor)
      .subscribe(
      res => {
        if (res.$key == -1) {
          this.caredonesDoctor = {
            DrName: 'Cureyo Doctor'
          };
        } else
          this.caredonesDoctor = res;
        console.log(" doc name in getCaredoneDoctor", this.caredonesDoctor);
      }

      )

  }//getCaredoneDoctor

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


  fetchOnboardingReview() {
    console.log(" i am in fetchOnboardingReview function:");
    this.route.params.subscribe(
      params => {
        let param = params['id'];
        //let caredoneKey = 10156182235515068;
        console.log("caredoneKey", param);
        this._authService._findCaredOne(this.currentUserID, param)
          .subscribe(
          data => {
            this.caredone = data;
            console.log(this.caredone);
          }
          )
        this._authService._findOnboardingReview(param)
          .subscribe(

          res => {
            if (res) {
              this.onboardingReview = res;
              console.log("onboardingReview data;", this.onboardingReview);
              if (this.onboardingReview.Summary) {
                this.dataReady = true;
                console.log(this.currentUser)
                console.log(this.caredone)
              }
              else {
                this.dataReady = false;
              }
              console.log(this.dataReady);
              if (this.onboardingReview.allAdded == "added") {
                this.allItemsAdded = true;

              }
              // this.sMed_len=this.onboardingReview.SuggestedMeds.length
              console.log("onboarding object is:", this.onboardingReview);
              //  console.log("length of SuggestedMed:", this.onboardingReview.SuggestedMeds.length);
              let exerTitles, exerValues, exerMax, medTitles, medValues, bsTitles, bsValues, bsMax, bpTitles, bpValuesSys, bpValuesDias, bpMax;
              this.caredonesDoctor = this._authService._findDoctor(this.onboardingReview.Doctor);
              // console.log("calling chart");
              // initDemo(exerTitles, exerValues, exerMax, medTitles, medValues, bsTitles, bsValues, bsMax,bpTitles, bpValuesSys,bpValuesDias, bpMax, this.onboardingReview.UnhealthyParameter[0].Name, this.onboardingReview.UnhealthyParameter[0].CurrentVal, this.onboardingReview.UnhealthyParameter[0].TargetVal, this.onboardingReview.UnhealthyParameter[1].Name, this.onboardingReview.UnhealthyParameter[1].CurrentVal, this.onboardingReview.UnhealthyParameter[1].TargetVal, this.onboardingReview.UnhealthyParameter[2].Name, this.onboardingReview.UnhealthyParameter[2].CurrentVal, this.onboardingReview.UnhealthyParameter[2].TargetVal)
              this.getCaredoneDoctor();
            }


          }

          );

      }
    )
  }//fetchOnboardingReview  

  //show the table that contains tests
  public showModal(testList) {

    $('#careModal').modal('show');

    window.scroll(0, -100);
    console.log($('#careplanContent'));
    $('#careplanContent').css({ position: 'fixed' });

    this.getBookingData(testList);

    this.testArray = [];
    this.labArray = [];
    this.labTotal = [];
    this.labArray2 = [];
    let refreshList = [], ctr = 0;
    console.log(this.testArray);
    console.log(this.labArray);
    console.log(this.labArray2);
    console.log(testList);
    console.log(this.labTotal);
    for (let item in testList) {
      if (item != '$exists' && item != '$key') {
        refreshList[ctr] = { name: '' };
        refreshList[ctr]['name'] = testList[item].name;
        ctr++;
      }

    }

    this.getBookingData(refreshList);

  }
  getBookingData(testList) {
    this.vendorSelected = false;
    let reqTests = testList;
    let labList = [], priceList = [], ctr = 0;

    console.log(testList);

    //this.labTotal = [0,0,0,0]

    console.log(reqTests);
    for (let test in reqTests) {

      console.log(reqTests[test].name)
      if (reqTests[test].name) {
        this._authService._findTestPrice(reqTests[test].name)
          .subscribe(res => {
            //res = JSON.parse(res);
            console.log("res", res)
            for (let lab in res) {
              if (lab != '$exists' && lab != '$key') {

                console.log(lab);
                this.testArray[test] = res;
                if (this.labArray[lab] != undefined) {
                  if (!priceList[lab]) {
                        priceList[lab] = 0;
                      }
                  priceList[lab] = parseInt(priceList[lab]) + parseInt(res[lab].price);
                  console.log("price list is ", priceList)
                  console.log(priceList);
                } else {
                  this.labArray[lab] = {};

                  this._authService._LabDetails(lab)
                    .subscribe(
                    labDets => {
                      this.labArray[lab] = {
                        labName: labDets.name,
                        labURL: labDets.labURL,
                        imageURL: labDets.logoURL,
                        homeCollect: labDets.homeCollection,
                        paymentOnline: labDets.paymentOnline,
                        id: lab
                      }
                      this.labArray2[ctr] = this.labArray[lab];

                      console.log(this.labArray)
                      console.log(this.testArray[test][lab].price);
                      if (!priceList[lab]) {
                        priceList[lab] = 0;
                      }
                        
                      priceList[lab] = parseInt(priceList[lab]) + parseInt(this.testArray[test][lab].price);
                      console.log("here is the price")
                      console.log(priceList[lab]);
                      ctr++;
                      this.dataNow = true;
                      this.labTotal = priceList;
                      console.log(this.labArray2);

                    }
                    )
                }
              }
            }

            console.log(this.testArray);
            console.log(this.labArray);
            console.log(this.labArray2);
            console.log(this.labTotal);

          });
      }

    }
  }
  closeModal() {

    $('#careModal').modal('hide');
    $('#careplanContent').css({ position: "" });

  }

  selectVendor(lab, total) {
    console.log("vendor selected")
    this.vendorSelected = true;

    console.log(this.caredone)
    this.bookOrder = this._fb.group({
      firstName: [this.caredone.firstName, Validators.required],
      lastName: [this.caredone.lastName, Validators.required],
      email: [this.currentUser.email, Validators.required],
      phone: [this.caredone.phone, Validators.required],
      address: [this.caredone.address, Validators.required],
      gender: [this.caredone.gender, Validators.required],
      serviceProvider: [lab, Validators.required],
      totalCost: [total, Validators.required],
      payment: ['', Validators.required],
      recOrder: ['', Validators.required]

    });
    this.vendorSelected = true;

  }

  onSubmit(model, event) {
    //console.log(model);
    //console.log("model");
    //this.caredOneId = model['uid']

    this.caredOneModel = model;
    var items = [], ctr = 0;
    for (let stuff in this.testArray) {
      if (stuff != '$key' && stuff != '$exists') {
        items[ctr] = this.testArray[stuff].$key;
        console.log(items[ctr])
        ctr++;
      }
    }

    this.vData = {

      name: model['firstName'],
      phone: model['phone'],
      address: model['address'],
      email: model['email'],
      gender: model['gender'],
      serviceProvider: model['serviceProvider'],
      items: items,
      totalCost: model['totalCost'],
      paymentMode: model['payment'],
      recurring: model['recOrder']
    };

    this._authService._orderDetails(this.caredone.uid, this.vData)
    .then(
      () => {
            if (model['payment'] == 'online') {
      window.location.href = "https://www.instamojo.com/Cureyo/cureyo-care-on-boarding-tests/?embed=form&data_name=" + this.currentUser.firstName + "&data_email=" + this.currentUser.email + "&data_phone=" + this.currentUser.phone + "&data_amount=" + model['totalCost'];
    }
    else {
      this.closeModal();
      $.notify({
        icon: "notifications",
        message: "Your order is being processed. We will get in touch with " + this.caredone.nickName + " to confirm the order."

      }, {
          type: 'cureyo',
          timer: 4000,
          placement: {
            from: 'top',
            align: 'right'
          }
        });
    }
      }
    )

  }
  showError() {
    this.showErrorFlag = true;
  }

}
