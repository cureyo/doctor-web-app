import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
declare var $: any
@Component({
  selector: 'app-existing-path-ways',
  templateUrl: './existing-path-ways.component.html',
  styleUrls: ['./existing-path-ways.component.css']
})
export class ExistingPathWaysComponent implements OnInit {
  @Input() partnerList: any;
  @Input() doctorId: any;
  @Input() TestNames: any;
  @Input() MedNames: any;
  @Input() pathData: any;
  private caredone: any;
  private online: any = "Online";
  private physical: any = "Physical";
  private pathological: any = "Pathological";
  private radiological: any = "Radiological";
  private existingPathWays: FormGroup;
  private carePathwayForm: FormGroup;
  private selectDrDomain: boolean = false;
  private showAnalysis: boolean = false;
  private newPath: boolean = false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private partnerUpdated: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private objectIdVal: any = [];
  private convenienceScore: any = 0;
  private convenienceTotal: any = 0;
  private profitScore: any = 0;
  private costScore: any = 0;
  public days: any = [];
  private times: any = [];
  public timeInterval: any = [];
  public dateInterval: any = [];
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;
  // private MedNames: any;
  // private TestNames: any;
  private consultant: any = [];
  private consultantSelected: any = [];
  private DATA: any;


  private dataloaded: boolean = false;


  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private http: Http,
    private _cacheService: CacheService) {


  }


  ngOnInit() {
    console.log("partner list in existing carepath:", this.partnerList);
    this.setIntervals();
    this.updateDays();
    this.updateTimes();
    console.log(this.pathData)
    // this._authService._getMedicineNames()
    // .subscribe(data => {
    //   ////console.log.log("patholodical test details data :",data);
    //   this.MedNames = data;
    //   this._cacheService.set('medNames', { 'data': this.MedNames }, { expires: Date.now() + 1000 * 60 * 60 });



    //   //console.log("the med names is :",this.MedNames);
    // });
    // this._authService._getPathologicalTests()
    // .subscribe(data => {
    //   //console.log("patholodical test details data :",data);
    //   this.TestNames = data;

    //   this._cacheService.set('testNames', { 'data': this.TestNames }, { expires: Date.now() + 1000 * 60 * 60 });

    //   //console.log("the med names is :",this.TestNames);
    // })

    this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);
    this.loadCarePath(this.pathData)
    // this.existingPathWays = this._fb.group({
    //       name: ['', Validators.required],
    //       objectId: [this.objectIdVal, Validators.required],
    //       consultant:[],
    //       checkPoints: this._fb.array([
    //             //  this.initializeCheckPoints(this.DATA,0)
    //       ])
    // });




  }
  updateDays() {
    this.days[0] = "Repeat";
    var i = 1;
    //console.log("day pushed")
    for (i = 1; i < 200; i++) {
      this.days[i] = i;

    }

    //.log("Days is:",this.days);
  }
  updateTimes() {
    this.times[0] = "Repeat";
    var i = 0;
    //console.log("time pushed", i)
    for (i = 0; i < 24; i++) {
      if (i < 10) {
        this.times[i + 1] = '0' + i + '00 hrs';
      }
      else {
        this.times[i + 1] = i + '00 hrs';
      }

    }
    //.log("times pushed", this.times)
  }

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
    ////.log("date interval",this.dateInterval);


  }//setTimeInterval


  loadCarePath(data) {
    console.log("loadCarePath called:", data);
    this.dataloaded = false;
    this.objectIdVal = data.objectId;
    this.existingPathWays = this._fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      objectId: [data.objectId, Validators.required],
      duration: [data.duration, Validators.required],
      checkPoints: this._fb.array([
        this.initializeCheckPoints(data.checkPoints[0], 0)
      ]),
      queries: this._fb.array([
        this.initializeQueries(data.queries[0], 0)
      ])
    });
    const control = <FormArray>this.existingPathWays.controls['checkPoints'];
    let ctr = 1;
    for (let each in data.checkPoints) {
      console.log(data.checkPoints[each]);
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control.push(this.initializeCheckPoints(data.checkPoints[each], ctr));
        ctr++;
      }
    }
    const control4 = <FormArray>this.existingPathWays.controls['queries'];
    let ctr2 = 1;
    for (let each in data.queries) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control4.push(this.initializeQueries(data.queries[each], ctr2));
        ctr2++;
      }
    }
    console.log(this.existingPathWays);
    var self = this;
    setTimeout(
      function () {
        self.dataloaded = true;
        self.analyticCalculations();
      }, 2000

    )
  }

  initCheckPoints() {
    return this._fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      messageText: ['', Validators.required],
      checkType: ['', Validators.required],
      consultant: [],
      options: this._fb.array([
        this.initOptions()
      ])
    });
  }

  addCheckPoints() {
    const control = <FormArray>this.existingPathWays.controls['checkPoints'];
    control.push(this.initCheckPoints());
    this.analyticCalculations();

  }


  showCarePath(model) {
    console.log("showing model", model)
    // this.newPath = false;
    this._authService._getCarePath(model.carePath)
      .subscribe(
      data => {
        this.DATA = data;
        console.log("show care path data is", data);
        if (data) {

          this.loadCarePath(data);
          //this.dataloaded = true;
        }
      }
      )
  }


  initializeOptions(data) {
    //console.log.log("initializeOptions click wid data",data);
    return this._fb.group({
      value: [data.value, Validators.required]
    });
  }
  initOptions() {
    //console.log.log("initializeOptions click wid data",data);
    return this._fb.group({
      value: ['option', Validators.required]
    });
  }

  initializeCheckPoints(data, check) {
    this.partnerUpdated = false;
    console.log("intitializecheckPoints", data);
    console.log(this.partnerList);
    console.log(data.consultant);
    let control = this._fb.group({
      day: [data.day, Validators.required],
      time: [data.time, Validators.required],
      messageText: [data.messageText, Validators.required],
      checkType: [data.checkType, Validators.required],
      consultant: [data.consultant],

      options: this._fb.array([
        this.initializeOptions(data.options[0])
      ])
    });
    console.log(control);
    //console.log.log("find out the control value:",control);
    const control2 = <FormArray>control.controls['options'];

    this.checkTypes[check] = data.checkType;
    console.log(control);
    if (data.consultant) {
      this.consultant[check] = data.consultant;
      this.consultantSelected[check] = true;

    }

    //console.log.log("this.checkTypes",this.checkTypes)

    //console.log.log("data.options",data.options);
    for (let each in data.options) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control2.push(this.initializeOptions(data.options[each]));

      }
    }
    console.log("control 2 data:", this.consultant, this.consultantSelected);
    this.partnerUpdated = true;
    return control;

  }

  initializeQueries(data, check) {
    //this.partnerUpdated = false;
    console.log("intitializequeries", data);
    let control = this._fb.group({
      query: [data.query, Validators.required],
      response: [data.response, Validators.required],
    });
    //console.log.log("find out the control value:",control);



    return control;

  }


  checkTypeSelect(type, i) {
    console.log("checktype is called:", type, i)
    if (type == "med-reminder") {
      this.checkTypes[i] = type;
      // this.setIntervals();

    } else if (type == "test-reminder") {
      // this.setIntervals();
      this.checkTypes[i] = type;

    } else if (type == "consult-reminder") {
      this.checkTypes[i] = type;
      // this.setIntervals();

    }
    else {

      this.checkTypes[i] = type;
    }

    // if (type == 'mcq')
    //   this.checkTypes[i] = true;
    // else this.checkTypes[i] = false;
  }

  consultantSelect(value, i) {
    console.log(value, i);
    this.consultant[i] = value;
    this.consultantSelected[i] = true;

  }
  addQueries() {
    const control = <FormArray>this.existingPathWays.controls['queries'];
    control.push(this.initQueries());

  }
  initQueries() {
    return this._fb.group({
      query: ['', Validators.required],
      response: ['', Validators.required]

    });
  }
  onSubmit(model) {
    console.log(model);
    this._authService._getCarePathNames(model['name'])
      .subscribe(
      data => {
        //console.log(data);
        if (data[0]) {
          alert("This Care Path already exisits. Please save using another name");
        }
        else {
          this._authService._saveCarePathway(model, model['name'])
            .then(data => {
              //console.log(data.path['o'][2]);
              this._authService._saveCarePathName(model['name'], data.path['o'][2]);
              this.existingPathWays.reset();
              this.existingPathWays = this._fb.group({
                name: ['', Validators.required],
                description: ['', Validators.required],
                duration: ['', Validators.required],
                checkPoints: this._fb.array([
                  this.initCheckPoints()
                ]),

                queries: this._fb.array([
                  this.initQueries()
                ])
              });
              this.dataloaded = false;
              $.notify({
                icon: "notifications",
                message: "Care Plan " + model['name'] + " has been saved."

              }, {
                  type: 'cureyo',
                  timer: 4000,
                  placement: {
                    from: 'top',
                    align: 'right'
                  }
                });

            });
        }

      }
      )

  }
  analyticCalculations() {

    let totArray2 = this.existingPathWays.controls['checkPoints'], convenienceTotal = 0, convenienceSc = 0, totalCost = 0, totalProfit = 0;
    let duration = this.existingPathWays.controls['duration'].value;
    var mulTable = {
      "2months": 2, "weekly": 0.25, "monthly": 1, "2weeks": 0.5, "3months": 3, "3weeks": 0.75
    }
    console.log(totArray2, "totArray2");
    let totArray = totArray2.value
    console.log(totArray, "totArray1")
    this._authService._getTransactionData(this.objectIdVal)
      .subscribe(transData => {
        this._authService._getPartner(this.doctorId).subscribe(
          partData => {
            for (let item of totArray) {

              if (item.checkType == 'online-review' || item.checkType == 'consult-reminder' || item.checkType == 'test-reminder' || item.checkType == 'scan-reminder') {
                convenienceTotal++;
                if (item.checkType == 'online-review' || item.checkType == 'test-reminder') {
                  convenienceSc++;
                }

              }
              if (item.checkType == 'online-review' || item.checkType == 'consult-reminder') {
                if (item.consultant && partData.consult[item.consultant]) {
                  console.log(transData[item.consultant]);
                  totalCost = totalCost + parseInt(partData.consult[item.consultant].fee) * (parseInt(duration) / mulTable[transData[item.consultant][(item.checkType == 'consult-reminder') ? 'Physical' : 'Online'].Job_Frequency]);
                  totalProfit = totalProfit + parseInt(partData.consult[item.consultant].fee) * ((parseInt(duration) / mulTable[transData[item.consultant][(item.checkType == 'consult-reminder') ? 'Physical' : 'Online'].Job_Frequency]) * ((item.checkType == 'consult-reminder') ? 0.05 : 0.1))
              }
              }
              if (item.checkType == 'test-reminder' || item.checkType == 'scan-reminder') {
                this._authService._getPaymentPlans(this.doctorId)
                  .subscribe(
                  payPlans => {
                    console.log("payPlans", payPlans);
                    console.log(payPlans.plans[0]['services'][(item.checkType == 'test-reminder') ? 'Pathological' : 'Radiological'].partner);
                    let partnerId = payPlans.plans[0]['services'][(item.checkType == 'test-reminder') ? 'Pathological' : 'Radiological'].partner;
                    console.log(transData)
                    console.log(transData[(item.checkType == 'test-reminder') ? 'PathologicalLabTest' : 'RadiologicalLabTest'])
                    let testArrays = transData[(item.checkType == 'test-reminder') ? 'PathologicalLabTest' : 'RadiologicalLabTest'];
                    for (let test of testArrays) {
                      for (let testItem of test.TestName) {
                        this._authService._getTestPrice((item.checkType == 'test-reminder') ? 'Pathological' : 'Radiological', testItem, partnerId)
                          .subscribe(
                          priceData => {
                            console.log("priceData", priceData)
                            totalCost = totalCost + parseInt(priceData.price) * (parseInt(duration) / mulTable[test.TestFreq]);
                            totalProfit = totalProfit + (parseInt(priceData.price) * (parseInt(duration) / mulTable[test.TestFreq]) * ((item.checkType == 'test-reminder') ? 0.1 : 0.15))
                            console.log("totalCost", totalCost);
                            this.costScore = Math.round(totalCost);
                            this.profitScore = Math.round(totalProfit);
                          }
                          )
                      }
                    }

                  }
                  )
                // if (item.consultant && partData.consult[item.consultant]) {
                //   totalCost = totalCost + partData.consult[item.consultant].fee;
                // }
              }
            }
            this.convenienceScore = Math.round(100 * convenienceSc / convenienceTotal);
            //this.costScore = Math.round(totalCost);
          }
        )



      })
  }
  showAnal() {
    this.showAnalysis = !this.showAnalysis;
  }
}
