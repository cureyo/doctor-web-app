import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Http, Response } from '@angular/http';
import { AuthService } from "../../services/firebaseauth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

declare var $: any


@Component({
  selector: 'care-paths-cmp',
  templateUrl: 'care-pathways.component.html',
  moduleId: module.id
})

export class CarePathsComponent implements OnInit {
  [name: string]: any;

  private caredone: any;
  private section: any = "care";
  private drDomain: FormGroup;
  private carePathwayForm: FormGroup;
  private selectDrDomain: boolean = false;
  private newPath: boolean = false;
  private caredOneId: any;
  private displayDrDomain: boolean = false;
  private array: any;
  private routeparam: any;
  private checkTypes: any = [];
  private objectIdVal: any = [];
  private days: any = [];
  private partnerList: any = [];
  private times: any = [];
  public timeInterval: any = [];
  public dateInterval: any = [];
  private findCarePaths: FormGroup;
  private carePathsAvlbl: any;
  private MedNames: any;
  private TestNames: any;
  private doctorId: any;
  private consultant: any = [];
  private consultantSelected: any = [];


  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private http: Http,
    private _cacheService: CacheService) {


  }
  updateDays() {
    let i = 0;
    //console.log("day pushed")
    for (let i = 0; i < 200; i++) {
      this.days[i] = i;
      ////console.log("days pushed", i)
    }
  }
  updateTimes() {
    let i = 0;
    //console.log("time pushed", i)
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.times[i] = '0' + i + '00 hrs';
        ////console.log("times pushed", i)
      }
      else {
        this.times[i] = i + '00 hrs';
      }

    }
  }
  ngOnInit() {
    this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);
    this.updateDays();
    this.updateTimes();
    this.drDomain = this._fb.group({
      message: [''],
    });
    this.selectDrDomain = true;
    this.carePathwayForm = this._fb.group({
      name: ['', Validators.required],
      objectId: [this.objectIdVal, Validators.required],
      checkPoints: this._fb.array([
        this.initCheckPoints()
      ])
    });

    this.findCarePaths = this._fb.group({
      carePath: ''
    });

    ////console.log(this.ObserversForm);


    this._authService._getCarePathway()
      .subscribe(
      data => {
        //console.log(data);
        this.carePathsAvlbl = data;
        //console.log(this.carePathsAvlbl)
      }
      )
    this._authService._getUser()
      .subscribe(
      userData => {
        this.doctorId = userData.user.uid;
        this._authService._getPartner(userData.user.uid)
          .subscribe(
          partnerData => {

            if (partnerData['consultant']) {
              let ctr = 0, partnersC = [];
              let consultants = partnerData['consultant'];
              console.log(partnerData['consultant']);
              for (let item in consultants) {

                console.log(item)
                if (item != 'length' && item != '$exists' && item != '$key') {
                  partnersC[ctr] = consultants[item];
                  partnersC[ctr]['key'] = item;
                  ctr++
                }

              }
              this.partnerList = partnersC;
              console.log(this.partnerList);


            }
          }
          )

      }
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


  initializeCheckPoints(data, check) {
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
    const control2 = <FormArray>control.controls['options'];

    this.checkTypes[check] = data.checkType;
    if (data.consultant) {
      this.consultant[check] = data.consultant;
      this.consultantSelected[check] = true;
    }

    console.log(this.checkTypes)

    console.log(data.options);
    for (let each in data.options) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control2.push(this.initializeOptions(data.options[each]));

      }
    }
    return control;

  }
  initializeOptions(data) {
    return this._fb.group({
      value: [data.value, Validators.required]
    });


  }
  loadCarePath(data) {
    console.log(data);
    this.objectIdVal = data.objectId;
    this.carePathwayForm = this._fb.group({
      name: [data.name, Validators.required],
      objectId: [data.objectId, Validators.required],
      checkPoints: this._fb.array([
        this.initializeCheckPoints(data.checkPoints[0], 0)
      ])
    });
    const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
    let ctr = 1;
    for (let each in data.checkPoints) {
      if (each != '$key' && each != '$value' && each != '$exists' && each != '0') {
        control.push(this.initializeCheckPoints(data.checkPoints[each], ctr));
        ctr++;
      }
    }

    console.log(this.carePathwayForm);
    var self = this;
    setTimeout(function () {
      self.newPath = true;
      console.log("showing form now")
    }, 2000)
  }
  initOptions() {
    return this._fb.group({
      value: ['Option', Validators.required]
    });
  }
  addCheckPoints() {
    const control = <FormArray>this.carePathwayForm.controls['checkPoints'];
    control.push(this.initCheckPoints());

  }//addReports
  addOptions(check, i) {

    const control = <FormArray>check.controls['options'];

    control.push(this.initOptions());
    //console.log(control);

  }//addReports

  createPathways() {
    this.carePathwayForm.reset();
    this.newPath = false;
    this.objectIdVal = Math.floor((Math.random() * 1000000000) + 1);
    this.carePathwayForm = this._fb.group({
      name: ['', Validators.required],
      objectId: [this.objectIdVal, Validators.required],
      checkPoints: this._fb.array([
        this.initCheckPoints()
      ])
    });
    this.selectDrDomain = true;
    setTimeout(
      () => {
        this.newPath = true;
      }, 2000
    )


  }
  selectDomainMenu() {

    this.selectDrDomain = true;
    //console.log("redirecting to ", "website")
    this.router.navigate(['website'])

  }
  checkTypeSelect(type, i) {
    console.log("check type is", type, " for ", i);
    ////console.log()
    if (type == "med-reminder") {
      this.setIntervals();
      this._authService._getMedicineNames()
        .subscribe(data => {
          //console.log("patholodical test details data :",data);
          this.MedNames = data;
          this._cacheService.set('medNames', { 'data': this.MedNames }, { expires: Date.now() + 1000 * 60 * 60 });

          this.checkTypes[i] = type;

          //console.log("the med names is :",this.MedNames);
        })
    } else if (type == "test-reminder") {
      this.setIntervals();
      this._authService._getPathologicalTests()
        .subscribe(data => {
          //console.log("patholodical test details data :",data);
          this.TestNames = data;

          this._cacheService.set('testNames', { 'data': this.TestNames }, { expires: Date.now() + 1000 * 60 * 60 });
          this.checkTypes[i] = type;
          //console.log("the med names is :",this.TestNames);
        })
    } else if (type == "consult-reminder") {
      this.checkTypes[i] = type;
      this.setIntervals();

    }
    else {

      this.checkTypes[i] = type;
    }

    // if (type == 'mcq')
    //   this.checkTypes[i] = true;
    // else this.checkTypes[i] = false;
  }
  searchDomain = (model) => {
    let job = model['value'];
    let reminder = {};
    this.routeparam = job['message'];
    reminder['message value'] = job['message'];
    //console.log("reminder value test ", reminder);
    //console.log("i am clicked to check domain name")

    this.getData(job['message']).subscribe(data => {
      //console.log(data);
      this.array = data;
      //console.log(this.array)
      this.displayDrDomain = true;

    });



  }
  getData(domainName) {

    const domainURL = "https://api.ote-godaddy.com/v1/domains/suggest?query=" + domainName + "&country=IN&city=bangalore&sources=CC_TLD%2CEXTENSION%2CKEYWORD_SPIN%2CPREMIUM%2Ccctld%2Cextension%2Ckeywordspin%2Cpremium&tlds=.com&lengthMax=15&lengthMin=5&limit=10&waitMs=6000";

    return this.http.get(domainURL)
      .map((res: Response) => res.json());

  }

  onSubmit(model) {
    console.log(model);
    this._authService._getCarePathNames(model['name'])
      .subscribe(
      data => {
        console.log(data);
        if (data[0]) {
          alert("This Care Path already exisits. Please save using another name");
        } else {
          this._authService._saveCarePathway(model, model['name'])
            .then(data => {
              console.log(data.path['o'][2]);
              this._authService._saveCarePathName(model['name'], data.path['o'][2]);
              this.carePathwayForm.reset();
              this.carePathwayForm = this._fb.group({
                name: ['', Validators.required],
                checkPoints: this._fb.array([
                  this.initCheckPoints()
                ])
              });
              this.newPath = false;
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
  showCarePath(model) {
    console.log("showing")
    console.log(model)
    this.carePathwayForm.reset();
    this.newPath = false;
    this._authService._getCarePath(model.carePath)
      .subscribe(
      data => {
        console.log(data);
        this.loadCarePath(data);

      }
      )
  }
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

  consultantSelect(value, i) {
    console.log(value, i);
    this.consultant[i] = value;
    this.consultantSelected[i] = true;

  }


}


